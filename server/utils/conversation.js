// Builds a deterministic conversation ID from two user IDs,
// regardless of who's "sender" vs "receiver" — so both sides
// always land in the same conversation/room.
export const getConversationId = (userIdA, userIdB) => {
  return [String(userIdA), String(userIdB)].sort().join("_");
};