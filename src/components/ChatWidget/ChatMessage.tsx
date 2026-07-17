interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp?: string;
  intent?: string;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'bot';
  const time = new Date(message.timestamp || new Date().toISOString()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex items-end gap-2 mb-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
          JS
        </div>
      )}

      <div className={`flex flex-col max-w-[75%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
            isBot
              ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
              : 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-tr-sm shadow-md'
          }`}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-gray-400 mt-1 px-1">{time}</span>
      </div>
    </div>
  );
}