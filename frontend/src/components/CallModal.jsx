import React, { useState } from "react";
import { Phone, Copy, Check, X } from "lucide-react";

const CallModal = ({ isOpen, onClose, contactName, phone }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const displayPhone = phone || "+91 98765 43210";

  const handleCopy = () => {
    navigator.clipboard.writeText(displayPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeCall = () => {
    window.location.href = `tel:${displayPhone}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-4">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
            <Phone className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-white">Call {contactName || "Contact"}</h3>
          <p className="text-xs font-semibold text-slate-400">
            Connect directly via cellular network
          </p>
        </div>

        {/* PHONE DISPLAY CARD */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone Number</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono tracking-wide">
              {displayPhone}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition flex items-center gap-1 text-xs font-bold"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleNativeCall}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
          >
            <Phone className="w-4.5 h-4.5" />
            <span>Open Phone Dialer</span>
          </button>

          <button
            onClick={onClose}
            className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition text-xs"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};

export default CallModal;
