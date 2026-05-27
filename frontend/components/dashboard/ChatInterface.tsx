"use client";

import { useEffect, useRef, useState } from "react";
import { interviewApi, type ChatMessage } from "@/lib/interviewApi";

interface ChatInterfaceProps {
  reportId: string;
  onClose: () => void;
}

const SUGGESTED_MESSAGES = [
  "Start with a technical question",
  "Give me feedback on my answers",
  "Ask about a specific skill gap",
  "Help me with behavioral questions",
];

export default function ChatInterface({ reportId, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history on mount
  useEffect(() => {
    interviewApi.getChatHistory(reportId)
      .then(({ chatHistory }) => {
        setMessages(chatHistory);
      })
      .catch(() => setError("Failed to load chat history."))
      .finally(() => setLoadingHistory(false));
  }, [reportId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const message = (text || input).trim();
    if (!message || loading) return;

    setInput("");
    setLoading(true);
    setError(null);

    // Optimistically add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const { chatHistory } = await interviewApi.chat(reportId, message);
      setMessages(chatHistory);
    } catch {
      setError("Failed to get response. Please try again.");
      // Remove the optimistic message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = async () => {
    try {
      await interviewApi.clearChatHistory(reportId);
      setMessages([]);
    } catch {
      setError("Failed to clear chat.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 flex h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-gray-700 bg-gray-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20">
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 1 0-.697.972.972 0 0 1-.537-.086 5 5 0 0 1-.99-.21c-.2-.082-.392-.163-.583-.243a5.998 5.998 0 0 1-.45-.721c-.038-.181-.07-.362-.105-.543a1 1 0 0 0-.122-.516A1 1 0 0 0 3 12m9-2.25v-.008c0-1.186-.36-2.302-1-3.205m3.106-2.108a7.963 7.963 0 0 0-.463-1.684m-3.92 1.766c.25.163.463.346.628.528l.016.025A.75.75 0 0 1 6 7.5m0 0a.376.376 0 0 1-.188-.46.373.373 0 0 1 .188-.46.374.374 0 0 1 .46-.187c.104 0 .2.042.277.11.077.068.157.146.236.232l.017.025.025.025.232.236.025.025.11.077a.375.375 0 0 1 .188.46.373.373 0 0 1-.188.46.373.373 0 0 1-.188-.46.375.375 0 0 1 .112-.295l.017-.025.025-.025.025-.025a.75.75 0 0 1 .39-.46m3.107.96c-.077.086-.162.17-.252.252l-.025.025a.376.376 0 0 1-.46.188.373.373 0 0 1-.187-.46.375.375 0 0 1 .188-.46.375.375 0 0 1 .46-.188c.104 0 .2.042.277.11.077.068.157.146.236.232l.017.025.025.025.232.236.025.025.11.077a.375.375 0 0 1 .188.46.373.373 0 0 1-.188.46.373.373 0 0 1-.46-.188.373.373 0 0 1-.11-.295l-.017-.025.025-.025.025-.025a.75.75 0 0 1 .39-.46M12 16.5v1.5m0-1.5h-1.5m1.5 0v1.5m0-1.5v-1.5m-1.5 1.5h1.5m-1.5 0v-1.5m0 1.5h1.5m-1.5 0v-1.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Mock Interview</h2>
              <p className="text-xs text-gray-500">AI-powered practice session</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/15">
                <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 1 0-.697.972.972 0 0 1-.537-.086 5 5 0 0 1-.99-.21c-.2-.082-.392-.163-.583-.243a5.998 5.998 0 0 1-.45-.721c-.038-.181-.07-.362-.105-.543a1 1 0 0 0-.122-.516A1 1 0 0 0 3 12" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Ready for Practice</h3>
              <p className="mb-6 max-w-sm text-sm text-gray-500">
                Ask me anything about interview preparation, or choose a suggested topic below.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_MESSAGES.map((msg) => (
                  <button
                    key={msg}
                    onClick={() => handleSend(msg)}
                    className="rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-2 text-xs text-gray-400 hover:border-indigo-500/50 hover:bg-gray-800 hover:text-indigo-300 transition-colors"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-gray-800 px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-gray-500">Thinking...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-center">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3 6l3 6m0 0 3 6m-3-6h12" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-gray-600">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}