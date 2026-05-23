import ChatWindow from '../components/ChatWidget/ChatWindow';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[85vh] flex flex-col">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Chat Assistant</h1>
          <p className="text-sm text-gray-500 mt-1">
            Your personal guide to jobs, matches, and everything JobSwipe
          </p>
        </div>

        <div className="flex-1 min-h-0 shadow-xl rounded-2xl overflow-hidden border border-white">
          <ChatWindow fullPage />
        </div>
      </div>
    </div>
  );
}