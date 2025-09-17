import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  _id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
export type Posts = IPost[];

const postSchema = new Schema({
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

  title: { type: String, require: true },
  content: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: () => Date.now() },
});

const PostModel: Model<IPost> = mongoose.model<IPost>("Post", postSchema);

export default PostModel;
