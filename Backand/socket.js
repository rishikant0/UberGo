import { Server } from "socket.io";
import UserModel from "./models/user.model.js";
import CaptainModel from "./models/captain.model.js";

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
      const { userId, location } = data;

      if (!location?.latitude || !location?.longitude) return;

      try {
        await CaptainModel.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
        });
      } catch (err) {
        console.error("Location update error:", err);
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
