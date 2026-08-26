import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isValid = text.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 h-12 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white caret-emerald-400 placeholder-slate-400 text-sm font-semibold px-4 rounded-xl outline-none transition disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!isValid || disabled}
        className="w-12 h-12 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 disabled:scale-100 text-white rounded-xl flex items-center justify-center transition shadow-lg shrink-0 cursor-pointer"
      >
        <Send className="w-5 h-5 text-white" />
      </button>
    </form>
  );
};

export default ChatInput;
