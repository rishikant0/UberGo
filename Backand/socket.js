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
    console.log("New connection:", socket.id);

    /* ================= JOIN ================= */
    socket.on("join", async (data) => {
      const userId = data?.userId || data?.user?._id;
      const role = data?.role;

      if (!userId || !role) {
        console.log("Join rejected — missing userId or role");
        return;
      }

      try {
        if (role === "user") {
          await UserModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
          socket.userId = userId;
          socket.role = "user";
          console.log("User joined:", userId);
        }

        if (role === "captain") {
          await CaptainModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
          socket.userId = userId;
          socket.role = "captain";
          console.log("Captain joined:", userId);
        }
      } catch (error) {
        console.error("Socket join error:", error);
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
      console.log("Disconnected:", socket.id);

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

/* ================= SEND MESSAGE ================= */
export const sendMessageToSocketId = (socketId, messageObject) => {
  if (!io || !socketId) {
    console.error("Invalid socketId or io not initialized");
    return;
  }

  console.log(
    "Sending event:",
    messageObject.event,
    "to socket:",
    socketId
  );

  io.to(socketId).emit(messageObject.event, messageObject.data);
};
