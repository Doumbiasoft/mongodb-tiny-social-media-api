import mongoose, { Schema, Document, Model } from "mongoose";
import { ValidationPatterns } from "../middlewares/validation.middleware";

export interface IUser extends Document {
  _id: string;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
export type Users = IUser[];

const emailValidators = [
  {
    // Validator 1: Check if the email is valid.
    validator: function (email: string) {
      return ValidationPatterns.EMAIL.test(email);
    },
    message: (props: any) =>
      `${props.path}:(${props.value}) is not a valid email address.`,
  },
  {
    validator: async function (email: string) {
      // Query the database to see if another user exists with the same email
      const user = await mongoose.models.User.findOne({ email });
      // Return true if no other user is found, indicating a unique email
      return !user;
    },
    message: (props: any) =>
      `${props.value} is already in use. Please choose a different email.`,
  },
];

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
    minLength: [3, "The name length should not be less than 3"],
    maxLength: [50, "The name length should not be over 50"],
  },
  username: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: async function (username: string) {
        // Query the database to see if another user exists with the same username
        const user = await mongoose.models.User.findOne({ username });
        // Return true if no other user is found, indicating a unique username
        return !user;
      },
      message: (props: any) =>
        `${props.value} is already in use. Please choose a different username.`,
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    validate: emailValidators,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: () => Date.now() },
});

userSchema.statics.getCount = async function () {
  return await mongoose.models.User.countDocuments();
};

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserModel;
