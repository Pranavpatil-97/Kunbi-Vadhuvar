import Interest from "../models/Interest.js";

// Chat is only allowed between users who have a mutually accepted interest
export const areMatched = async (userIdA, userIdB) => {
  const match = await Interest.findOne({
    status: "accepted",
    $or: [
      { sender: userIdA, receiver: userIdB },
      { sender: userIdB, receiver: userIdA },
    ],
  });
  return !!match;
};