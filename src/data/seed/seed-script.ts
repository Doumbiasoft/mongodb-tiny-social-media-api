import CommentModel from "../../models/Comment";
import PostModel from "../../models/Post";
import UserModel from "../../models/User";
import usersData from "../seed/user.json";
import postsData from "../seed/post.json";
import commentsData from "../seed/comment.json";

export const seedScript = async () => {
  const existingUserCount = await UserModel.countDocuments();
  const existingPostCount = await PostModel.countDocuments();
  const existingCommentCount = await CommentModel.countDocuments();

  if (
    existingUserCount > 0 ||
    existingPostCount > 0 ||
    existingCommentCount > 0
  ) {
    console.log("Database already seeded.");
    return;
  }
  const seededUsers = await UserModel.insertMany(usersData);
  console.log("Users seeded.");

  // Seed Posts with exactly 3 posts per user
  const postsToSeed = [];

  // Assign 3 posts to the first user
  for (let i = 0; i < 3; i++) {
    // Check if seededUsers[0] exists before assigning
    if (seededUsers[0]) {
      postsToSeed.push({ ...postsData[i], userId: seededUsers[0]._id });
    }
  }

  // Assign 3 posts to the second user
  for (let i = 3; i < 6; i++) {
    // Check if seededUsers[1] exists before assigning
    if (seededUsers[1]) {
      postsToSeed.push({ ...postsData[i], userId: seededUsers[1]._id });
    }
  }

  // Assign 3 posts to the third user
  for (let i = 6; i < 9; i++) {
    // Check if seededUsers[2] exists before assigning
    if (seededUsers[2]) {
      postsToSeed.push({ ...postsData[i], userId: seededUsers[2]._id });
    }
  }
  const seededPosts = await PostModel.insertMany(postsToSeed);
  console.log("Posts seeded.");

  // Seed Comments
  const commentsToSeed = commentsData.map((comment, index) => {
    // Assign specific users and posts to comments
    const userId = seededUsers[index % seededUsers.length]._id;
    const postId = seededPosts[index % seededPosts.length]._id;
    return { ...comment, userId, postId };
  });

  await CommentModel.insertMany(commentsToSeed);
  console.log("Comments seeded.");

  console.log("Database seeded successfully.");
};
