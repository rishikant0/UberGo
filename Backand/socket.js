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
    console.log("New user connected:", socket.id);

    socket.on("join", async (data) => {
      const userId = data.userId || data.user?._id;
      const role = data.role || data.userType || data.roleType;

      try {
        if (role === "user") {
          await UserModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        }

        if (role === "captain") {
          await CaptainModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        }
      } catch (error) {
        console.error("Socket join error:", error);
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (!location || !location.latitude || !location.longitude) {
        return socket.emit("error", {
          message: "Invalid location data",
        });
      }

      // Store as GeoJSON Point: { type: 'Point', coordinates: [lng, lat] }
      try {
        await CaptainModel.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
        });
      } catch (err) {
        console.error("Failed to update captain location:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(
    "Sending message to socketId:",
    socketId,
    "Message:",
    messageObject
  );

  if (io && socketId) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.error("Socket.io not initialized or invalid socketId");
  }
};
