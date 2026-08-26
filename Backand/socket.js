import { Server } from "socket.io";
import UserModel from "./models/user.model.js";
import CaptainModel from "./models/captain.model.js";
import MessageModel from "./models/message.model.js";
import RideModel from "./models/ride.model.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New connection:", socket.id);

    /* ================= JOIN ================= */
    socket.on("join", async (data) => {
      const userId = data?.userId || data?.user?._id;
      const role = data?.role;

      if (!userId || !role) {
        console.log("❌ Join rejected — missing data");
        return;
      }

      try {
        socket.userId = userId;
        socket.role = role;

        // ⭐ JOIN ROOM (IMPORTANT)
        socket.join(userId.toString());

        if (role === "user") {
          await UserModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
          console.log("👤 User joined:", userId);
        }

        if (role === "captain") {
          await CaptainModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
          console.log("🚖 Captain joined:", userId);
        }

      } catch (error) {
        console.error("Join error:", error);
      }
    });

    /* ================= UPDATE CAPTAIN LOCATION ================= */
    socket.on("update-location-captain", async (data) => {
      const { userId, location, rideId } = data;

      if (!location?.latitude || !location?.longitude) return;

      try {
        await CaptainModel.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
        });

        // Broadcast to specific ride user if active
        if (rideId) {
          const ride = await RideModel.findById(rideId);
          if (ride && ride.user) {
            sendMessageToUserId(ride.user._id, {
              event: "captain-location-updated",
              data: {
                captainId: userId,
                location: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
              },
            });
          }
        }
      } catch (err) {
        console.error("Location update error:", err);
      }
    });

    /* ================= CHAT: SEND MESSAGE ================= */
    socket.on("send-message", async (data) => {
      const { rideId, senderId, senderModel, senderName, receiverId, receiverModel, message } = data;

      if (!rideId || !senderId || !receiverId || !message) {
        console.warn("⚠️ Invalid message payload");
        return;
      }

      try {
        const savedMessage = await MessageModel.create({
          ride: rideId,
          sender: senderId,
          senderModel: senderModel || "User",
          senderName: senderName || "Sender",
          receiver: receiverId,
          receiverModel: receiverModel || (senderModel === "User" ? "Captain" : "User"),
          message: message.trim(),
        });

        const msgPayload = {
          _id: savedMessage._id,
          rideId,
          senderId,
          senderModel: savedMessage.senderModel,
          senderName: savedMessage.senderName,
          receiverId,
          message: savedMessage.message,
          timestamp: savedMessage.createdAt,
        };

        // Emit to sender for optimistic confirmation
        socket.emit("message-sent", msgPayload);

        // Emit to receiver
        sendMessageToUserId(receiverId, {
          event: "receive-message",
          data: msgPayload,
        });

        console.log(`💬 Chat message delivered from ${senderName} to ${receiverId}`);
      } catch (err) {
        console.error("Send message socket error:", err);
      }
    });

    /* ================= DISCONNECT ================= */
    socket.on("disconnect", async () => {
      console.log("🔴 Disconnected:", socket.id);

      try {
        if (socket.role === "user") {
          await UserModel.findByIdAndUpdate(socket.userId, {
            socketId: null,
          });
        }

        if (socket.role === "captain") {
          await CaptainModel.findByIdAndUpdate(socket.userId, {
            socketId: null,
          });
        }
      } catch (err) {
        console.error("Disconnect cleanup error:", err);
      }
    });
  });

  return io;
};


/* =====================================================
   ⭐ SEND MESSAGE — SAFE METHOD (ROOM + SOCKETID)
===================================================== */

export const sendMessageToSocketId = (socketId, messageObject) => {
  if (!io || !socketId) {
    console.error("❌ Invalid socketId or io not initialized");
    return;
  }

  console.log(
    "📤 Sending event:",
    messageObject.event,
    "to:",
    socketId
  );

  // Send directly to socket ID
  io.to(socketId).emit(messageObject.event, messageObject.data);
};


/* =====================================================
   ⭐ NEW — SEND BY USER/CAPTAIN ID (RECOMMENDED)
===================================================== */

export const sendMessageToUserId = (userId, messageObject) => {
  if (!io || !userId) return;

  console.log(
    "📤 Sending event:",
    messageObject.event,
    "to room:",
    userId
  );

  io.to(userId.toString()).emit(
    messageObject.event,
    messageObject.data
  );
};
