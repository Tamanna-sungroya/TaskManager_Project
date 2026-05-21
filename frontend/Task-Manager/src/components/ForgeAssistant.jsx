import React, { useState, useEffect } from "react";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

const ForgeAssistant = () => {
  // Load messages from localStorage
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("forge_messages");

    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            role: "assistant",
            text: "Hi, I am Forge AI. Ask me to plan your day.",
          },
        ];
  });

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Save messages whenever updated
  useEffect(() => {
    localStorage.setItem(
      "forge_messages",
      JSON.stringify(messages)
    );
  }, [messages]);

  const ask = async () => {
    if (!query.trim()) return;

    const userQuery = query;

    setQuery("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Create user message
      const userMessage = {
        role: "user",
        text: userQuery,
      };

      // Add user message FIRST
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      const response = await fetch(
        `${BASE_URL}${API_PATHS.AI.ASK}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: userQuery }),
        }
      );

      const result = await response.json();

      console.log("AI RESULT:", result);

      // Fallback: try to get advice, or fallback to response.data.response, or fallback to generic message
      const aiText =
        result?.data?.advice ||
        result?.data?.response ||
        "Could not generate advice right now.";

      // Add advice message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: aiText,
        },
      ]);

      // If rankedTasks exist, show them as a separate message
      if (Array.isArray(result?.data?.rankedTasks) && result.data.rankedTasks.length > 0) {
        const rankedList = result.data.rankedTasks
          .map((task, idx) => `${idx + 1}. ${task.title} [${task.priority}] (${task.status})`)
          .join('\n');
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `Ranked Tasks:\n${rankedList}`,
          },
        ]);
      }
    } catch (error) {
      console.error("AI ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Could not generate advice right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  console.log("MESSAGES STATE:", messages);

  return (
    <div className="card mt-5 p-4 overflow-hidden">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Forge AI Assistant
      </h3>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3 bg-white dark:bg-gray-900">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[90%] ${
              message.role === "assistant"
                ? "bg-blue-100 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100 border border-blue-200 dark:border-blue-800"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ml-auto"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.text}
            </p>
          </div>
        ))}

        {loading && (
          <div className="bg-blue-100 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-fit border border-blue-200 dark:border-blue-800">
            Thinking...
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="flex gap-1 mt-4">
        <input
          type="text"
          id="chat-message"
          name="chat-message"
          className="flex-1 min-w-0 text-sm text-black dark:text-gray-100 outline-none bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 px-2 py-2 rounded-md placeholder:text-gray-500 dark:placeholder:text-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What should I do now?"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              ask();
            }
          }}
        />

        <button
          className="flex-shrink-0 px-2 py-2 text-xs font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700"
          onClick={ask}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ForgeAssistant;