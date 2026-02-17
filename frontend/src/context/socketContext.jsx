import React, { createContext, useEffect, useState, useCallback } from "react";
import io from "socket.io-client";

// Export the context so consumers can import it
export const SocketDataContext = createContext(null);

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Determine socket URL with fallback to VITE_URL or localhost
    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_URL || "http://localhost:4000";

    if (!socketUrl) {
      console.warn("No socket URL provided in env (VITE_SOCKET_URL or VITE_URL). Socket will not be initialized.");
      return;
    }

    console.log("Initializing socket to:", socketUrl);

    // Initialize socket connection
    const socketInstance = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection event
    socketInstance.on("connect", () => {
      console.log("Socket connected: ", socketInstance.id);
      setIsConnected(true);
      setSocket(socketInstance);
    });

    // Disconnect event
    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // Connection error
    socketInstance.on("connect_error", (error) => {
      console.log("Connection error: ", error);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Function to send message to a specific event
  const sendMessage = useCallback((eventName, data) => {
    console.log(`Sending message to event: ${eventName}`, data);

    if (socket && isConnected) {
      socket.emit(eventName, data);
    } else {
      console.warn("Socket is not connected");
    }
  }, [socket, isConnected]);

  // Function to receive message from a specific event
  const receiveMessage = useCallback((eventName, callback) => {
    console.log(`Registering listener for event: ${eventName}`);
    if (socket) {
      socket.on(eventName, callback);
    } else {
      console.warn(`Socket not ready yet for event: ${eventName}`);
    }
  }, [socket]);

  // Function to remove listener
  const removeListener = useCallback((eventName) => {
    console.log(`Removing listener for event: ${eventName}`);
    if (socket) {
      socket.off(eventName);
    }
  }, [socket]);

  const value = {
    socket,
    isConnected,
    sendMessage,
    receiveMessage,
    removeListener,
  };

  return (
    <SocketDataContext.Provider value={value}>
      {children}
    </SocketDataContext.Provider>
  );
};

export default SocketContextProvider;
