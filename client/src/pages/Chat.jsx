import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getConversation } from "../api/messages";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Chat = () => {
  const { userId: otherUserId } = useParams();
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    getConversation(otherUserId)
      .then((data) => setMessages(data.messages))
      .catch((err) => setError(err.response?.data?.message || "Failed to load chat"))
      .finally(() => setLoading(false));
  }, [otherUserId]);

  // Join the socket room + listen for incoming messages
  useEffect(() => {
    if (!socket || !connected) return;

    socket.emit("join_conversation", { otherUserId });

    const handleNewMessage = (msg) => {
      // Only add if it belongs to this conversation
      const isThisConvo =
        (msg.sender === otherUserId && msg.receiver === user.id) ||
        (msg.sender === user.id && msg.receiver === otherUserId);
      if (isThisConvo) setMessages((prev) => [...prev, msg]);
    };

    const handleError = (err) => setError(err.message);

    socket.on("new_message", handleNewMessage);
    socket.on("error_message", handleError);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("error_message", handleError);
    };
  }, [socket, connected, otherUserId, user.id]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;

    socket.emit("send_message", { receiverId: otherUserId, content: text.trim() });
    setText("");
  };

  return (
    <div className="min-h-screen bg-blush flex flex-col">
      <Navbar />

      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col px-4 py-6">
        <Link to="/matches" className="text-primary text-sm mb-4 inline-block w-fit">
          ← Back to Matches
        </Link>

        <div className="bg-white rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[400px] max-h-[60vh]">
            {loading && <p className="text-gray-500 text-sm">Loading messages...</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {!loading && messages.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-10">
                Say hello — this is the start of your conversation.
              </p>
            )}

            {messages.map((m) => {
              const isMine = (m.sender._id || m.sender) === user.id;
              return (
                <div key={m._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                      isMine
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t p-3 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={connected ? "Type a message..." : "Connecting..."}
              disabled={!connected}
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!connected || !text.trim()}
              className="bg-primary text-white rounded-full px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;