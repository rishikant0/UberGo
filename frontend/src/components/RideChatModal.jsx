import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { X, MessageSquare } from "lucide-react";
import { SocketDataContext } from "../context/socketContext";
import ChatInput from "./ChatInput";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL || "http://localhost:4000",
  timeout: 10000,
});

const RideChatModal = ({
  isOpen,
  onClose,
  rideId,
  currentUserId,
  currentRole,
  receiverId,
  receiverName,
  receiverPhoto,
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { socket } = useContext(SocketDataContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* FETCH CHAT HISTORY ON OPEN */
  useEffect(() => {
    if (!rideId || !isOpen) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/rides/${rideId}/messages`);
        if (res.data?.success) {
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.warn("Failed to fetch chat history:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [rideId, isOpen]);

  /* SCROLL ON NEW MESSAGES */
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  /* SOCKET LISTENERS FOR REALTIME CHAT */
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msgData) => {
      if (String(msgData.rideId) === String(rideId)) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(msgData._id))) return prev;
          return [...prev, msgData];
        });
      }
    };

    const handleMessageSent = (msgData) => {
      if (String(msgData.rideId) === String(rideId)) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(msgData._id))) return prev;
          return [...prev, msgData];
        });
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-sent", handleMessageSent);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-sent", handleMessageSent);
    };
  }, [socket, rideId]);

  /* SEND MESSAGE HANDLER */
  const handleSendMessage = (messageText) => {
    if (!rideId || !receiverId) return;

    const senderModel = currentRole === "captain" ? "Captain" : "User";
    const receiverModel = currentRole === "captain" ? "User" : "Captain";

    const payload = {
      rideId,
      senderId: currentUserId,
      senderModel,
      senderName: currentRole === "captain" ? "Captain" : "User",
      receiverId,
      receiverModel,
      message: messageText,
    };

    if (socket && socket.connected) {
      socket.emit("send-message", payload);
    } else {
      apiClient.post(`/rides/${rideId}/messages`, payload).then((res) => {
        if (res.data?.success && res.data.message) {
          const newMsg = res.data.message;
          setMessages((prev) => {
            if (prev.some((m) => String(m._id) === String(newMsg._id))) return prev;
            return [...prev, newMsg];
          });
        }
      }).catch((err) => {
        console.error("HTTP send message error:", err);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-md h-[90vh] max-h-[700px] flex flex-col shadow-2xl overflow-hidden relative font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* CHAT HEADER */}
        <div className="px-4 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={
                receiverPhoto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(receiverName || "Contact")}&background=0D9488&color=fff&bold=true`
              }
              alt={receiverName}
              className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shrink-0 bg-slate-800"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(receiverName || "Contact")}&background=0D9488&color=fff&bold=true`;
              }}
            />
            <div>
              <h4 className="text-sm font-extrabold text-white leading-tight">
                {receiverName || "Contact"}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-semibold text-emerald-400">
                  Ride Chat • Online
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            title="Close Chat (Ride Continues)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MESSAGES BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/80">
          {loading && messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-semibold">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-6 text-slate-500">
              <MessageSquare className="w-10 h-10 text-slate-700" />
              <p className="text-sm font-bold text-slate-300">No messages yet</p>
              <p className="text-xs text-slate-400">Send a message to coordinate your ride arrival!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = String(msg.senderId || msg.sender) === String(currentUserId);
              const timeStr = msg.timestamp || msg.createdAt
                ? new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <div
                  key={msg._id || index}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-md ${
                      isMe
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed break-words">{msg.message}</p>
                    {timeStr && (
                      <span
                        className={`text-[9px] block text-right mt-1 font-mono ${
                          isMe ? "text-emerald-100/90" : "text-slate-400"
                        }`}
                      >
                        {timeStr}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* HIGH CONTRAST CHAT INPUT */}
        <ChatInput onSendMessage={handleSendMessage} disabled={false} />

      </div>
    </div>
  );
};

export default RideChatModal;
