import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import api from '../../lib/api';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp?: string;
  intent?: string;
}

interface ChatWindowProps {
  onClose?: () => void;
  fullPage?: boolean;
}

const QUICK_REPLIES = [
  'Find me a job 🔍',
  'How does swiping work?',
  'Profile tips',
  'My matches',
];

export default function ChatWindow({
  onClose,
  fullPage = false,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────────────────────
  // Load chat history
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await api.get('/chatbot/history');

        if (data.history?.length > 0) {
          setMessages(data.history);
        } else {
          setMessages([
            {
              role: 'bot',
              content:
                "Hey! 👋 I'm your JobSwipe assistant. I can help you find jobs, improve your profile, understand how matching works, or answer any questions about the platform. What's up?",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } catch (error) {
        console.error('Chat history error:', error);

        setMessages([
          {
            role: 'bot',
            content:
              "Hey! 👋 I'm here to help with jobs, matching, and anything else about JobSwipe. Ask me anything!",
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setHistoryLoaded(true);
      }
    };

    loadHistory();
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Auto scroll
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, loading]);

  // ─────────────────────────────────────────────────────────────
  // Send message
  // ─────────────────────────────────────────────────────────────
  const sendMessage = async (text?: string) => {
    const trimmed = (text ?? input).trim();

    if (!trimmed || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chatbot/message', {
        message: trimmed,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: data.reply,
          intent: data.intent,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Chat message error:', error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content:
            'Oops, something went wrong on my end! Try again in a sec 😅',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Enter key handler
  // ─────────────────────────────────────────────────────────────
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`flex flex-col bg-gray-50 ${
        fullPage
          ? 'h-full rounded-2xl'
          : 'w-[360px] h-[520px] rounded-2xl shadow-2xl'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-t-2xl">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
          JS
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight">
            JobSwipe Assistant
          </p>

          <p className="text-white/70 text-xs">
            Friendly help, always here
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Close chat"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {!historyLoaded ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {loading && (
              <div className="flex items-end gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  JS
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />

                    <span
                      className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />

                    <span
                      className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Quick replies */}
      {historyLoaded &&
        messages.length <= 2 &&
        !loading && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {QUICK_REPLIES.map((qr) => (
              <button
                key={qr}
                onClick={() => sendMessage(qr)}
                className="shrink-0 text-xs bg-white border border-violet-200 text-violet-600 rounded-full px-3 py-1.5 hover:bg-violet-50 transition-colors whitespace-nowrap"
              >
                {qr}
              </button>
            ))}
          </div>
        )}

      {/* Input */}
      <div className="px-3 pb-3 pt-1">
        <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:border-violet-400 transition-colors">
          <textarea
            className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent max-h-24 leading-relaxed"
            rows={1}
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white disabled:opacity-40 transition-opacity shrink-0"
            aria-label="Send"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}