import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  _id: number;
  userId: number;
  postId: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Comments = IComment[];

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator: async function (userId: Schema.Types.ObjectId) {
        // Query the database to see if the user exists
        const user = await mongoose.models.User.findById({ _id: userId });
        // Return false if no user is found
        return !!user;
      },
      message: (props: any) =>
        `This user with ${props.path}: (${props.value}) does not exit.`,
    },
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    validate: {
      validator: async function (postId: Schema.Types.ObjectId) {
        // Query the database to see if the post exists
        const post = await mongoose.models.Post.findById({ _id: postId });
        // Return false if no post is found
        return !!post;
      },
      message: (props: any) =>
        `This post with ${props.path}: (${props.value}) does not exit.`,
    },
  },
  body: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: () => Date.now() },
});

const CommentModel: Model<IComment> = mongoose.model<IComment>(
  "Comment",
  commentSchema
);

export default CommentModel;
