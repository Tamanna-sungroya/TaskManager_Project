import React, { useState } from "react";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

const ForgeAssistant = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi, I am Forge AI. Ask me to plan your day." },
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!query.trim()) return;
    const userMessage = { role: "user", text: query };
    setMessages((m) => [...m, userMessage]);
    setQuery("");
    setLoading(true);
    try {
      setMessages((m) => [...m, { role: "assistant", text: "" }]);
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}${API_PATHS.AI.STREAM}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: userMessage.text }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Stream failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aggregate = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          aggregate += decoder.decode(value, { stream: true });
          setMessages((m) => {
            const next = [...m];
            next[next.length - 1] = { role: "assistant", text: aggregate };
            return next;
          });
        }
      }
    } catch {
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === "assistant" && !last.text) {
          next[next.length - 1] = { role: "assistant", text: "Could not generate advice right now." };
          return next;
        }
        return [...m, { role: "assistant", text: "Could not generate advice right now." }];
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-5">
      <h3 className="text-lg font-semibold mb-3">Forge AI Assistant</h3>
      <div className="space-y-2 max-h-72 overflow-auto mb-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`p-2 rounded ${m.role === "assistant" ? "bg-blue-50" : "bg-gray-100"}`}>
            <p className="text-sm">{m.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="form-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What should I do now?" />
        <button className="add-btn w-auto px-4" onClick={ask} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ForgeAssistant;
