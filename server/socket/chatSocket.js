import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { getConversationId } from "../utils/conversation.js";
import { areMatched } from "../utils/matchCheck.js";

// Authenticates the socket connection using the same JWT as REST auth
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) return next(new Error("Invalid user"));

    socket.userId = String(user._id);
    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
};

export const initChatSocket = (io) => {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(`Socket connected: user ${socket.userId}`);

    // Join a personal room so we can push notifications to this user
    // regardless of which conversation window they have open
    socket.join(socket.userId);

    // Client emits this when opening a chat with a specific match
    socket.on("join_conversation", async ({ otherUserId }) => {
      const matched = await areMatched(socket.userId, otherUserId);
      if (!matched) {
        return socket.emit("error_message", { message: "Not a mutual match" });
      }
      const conversationId = getConversationId(socket.userId, otherUserId);
      socket.join(conversationId);
    });

    // Client emits this to send a message
    socket.on("send_message", async ({ receiverId, content }) => {
      try {
        if (!content?.trim()) return;

        const matched = await areMatched(socket.userId, receiverId);
        if (!matched) {
          return socket.emit("error_message", { message: "Not a mutual match" });
        }

        const conversationId = getConversationId(socket.userId, receiverId);

        const message = await Message.create({
          conversationId,
          sender: socket.userId,
          receiver: receiverId,
          content: content.trim(),
        });

        // Send to everyone in the conversation room (both users, if both have it open)
        io.to(conversationId).emit("new_message", message);

        // Also notify the receiver's personal room in case they don't
        // have this specific chat open (for showing a notification badge)
        io.to(receiverId).emit("message_notification", {
          from: socket.userId,
          preview: content.trim().slice(0, 50),
        });
      } catch (err) {
        socket.emit("error_message", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: user ${socket.userId}`);
    });
  });
};