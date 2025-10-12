import React, { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Ready");
  const msgsRef = useRef(null);
  const formRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const escapeHtml = (s) =>
    s.replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ✅ Single source of truth: Netlify Function
  async function sendToBot(message) {
    // optional: trim history to keep payload small
    const trimmed = messages.slice(-20);

    const res = await fetch("/.netlify/functions/rp-bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona: "default", message, history: trimmed }),
    });

    if (!res.ok) throw new Error("Bot API error: " + res.status);
    const data = await res.json();
    return data.reply ?? "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    const content = input.trim();
    if (!content) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content }]);
    setStatus("Thinking…");
    try {
      const reply = await sendToBot(content);
      setMessages((m) => [...m, { role: "bot", content: reply }]);
      setStatus("Ready");
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "bot", content: "⚠️ There was a problem contacting the bot." }]);
      setStatus("Error");
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 grid gap-3 min-h-screen grid-rows-[auto,1fr,auto] text-slate-100 bg-[#0b0c10]">
      <header>
        <h1 className="text-lg font-semibold">RP Chat Bot</h1>
        <p className="text-xs opacity-80" aria-live="polite">{status}</p>
      </header>

      <section
        ref={msgsRef}
        className="rounded-xl border border-slate-800 bg-[#111318] p-3 flex flex-col gap-2 overflow-auto"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              "rounded-lg border border-slate-800 p-3 leading-relaxed " +
              (m.role === "user" ? "bg-slate-800/60" : "bg-slate-900")
            }
            dangerouslySetInnerHTML={{ __html: escapeHtml(m.content).replace(/\n/g, "<br/>") }}
          />
        ))}
      </section>

      <form ref={formRef} onSubmit={onSubmit} className="grid grid-cols-[1fr,auto] gap-2 items-start">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Speak to the narrator… Enter to send, Shift+Enter = newline."
          className="w-full min-h-12 max-h-40 resize-vertical p-3 rounded-lg border border-slate-800 bg-[#0b0c10] text-slate-100 outline-none"
        />
        <button
          type="submit"
          className="px-4 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:opacity-90 active:translate-y-px"
        >
          Send
        </button>
      </form>
    </div>
  );
}
