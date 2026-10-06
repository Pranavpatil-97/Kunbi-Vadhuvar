import Message from "../models/Message.js";
import { getConversationId } from "../utils/conversation.js";
import { areMatched } from "../utils/matchCheck.js";

// @route GET /api/messages/:userId
// @desc  Get chat history with a specific matched user (paginated)
export const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const matched = await areMatched(req.user._id, otherUserId);
    if (!matched) {
      return res.status(403).json({ message: "You can only chat with mutual matches" });
    }

    const conversationId = getConversationId(req.user._id, otherUserId);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 30, 100);
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    // Mark messages sent TO me as read
    await Message.updateMany(
      { conversationId, receiver: req.user._id, readAt: null },
      { readAt: new Date() }
    );

    res.json({ messages: messages.reverse(), page, limit }); // reverse → chronological order
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversation", error: error.message });
  }
};

// @route GET /api/messages
// @desc  List all conversations (matches) with last message + unread count
export const listConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const results = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiver", userId] }, { $eq: ["$readAt", null] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    res.json({ conversations: results });
  } catch (error) {
    res.status(500).json({ message: "Failed to list conversations", error: error.message });
  }
};