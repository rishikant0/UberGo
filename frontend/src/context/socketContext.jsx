import React, { createContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

export const SocketDataContext = createContext(null);

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_URL ||
      "http://localhost:4000";

    console.log("🔌 Connecting to socket:", socketUrl);

    // ✅ IMPORTANT — allow polling fallback
    const socketInstance = io(socketUrl, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    /* ================= CONNECT ================= */
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setSocket(socketInstance);
      setIsConnected(true);
    });

    /* ================= DISCONNECT ================= */
    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    /* ================= ERROR ================= */
    socketInstance.on("connect_error", (err) => {
      console.error("🚨 Socket connection error:", err.message);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  /* ================= SEND ================= */
  const sendMessage = useCallback(
    (eventName, data) => {
      if (socket && isConnected) {
        socket.emit(eventName, data);
      } else {
        console.debug("⏳ Socket connecting... Message will be sent once connected");
      }
    },
    [socket, isConnected]
  );

  /* ================= RECEIVE ================= */
  const receiveMessage = useCallback(
    (eventName, callback) => {
      if (!socket) return;

      socket.off(eventName); // remove old listeners
      socket.on(eventName, callback);

      console.log(`🎧 Listening for: ${eventName}`);
    },
    [socket]
  );

  /* ================= REMOVE ================= */
  const removeListener = useCallback(
    (eventName) => {
      if (socket) socket.off(eventName);
    },
    [socket]
  );

  return (
    <SocketDataContext.Provider
      value={{
        socket,
        isConnected,
        sendMessage,
        receiveMessage,
        removeListener,
      }}
    >
      {children}
    </SocketDataContext.Provider>
  );
};

export default SocketContextProvider;
