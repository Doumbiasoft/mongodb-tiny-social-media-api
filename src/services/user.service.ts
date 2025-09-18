import UserModel, { IUser } from "../models/User";

export const findAllUsers = async () => {
  return await UserModel.find();
};
export const findUser = async (data: { username?: string; email?: string }) => {
  let filter: any = {};
  if (data.username) {
    filter.username = data.username?.toString().trim().toLowerCase();
  }
  if (data.email) {
    filter.email = data.email?.toString().trim().toLowerCase();
  }
  return await UserModel.findOne(filter);
};
export const findUserById = async (userId: string) => {
  return await UserModel.findById({ _id: userId });
};
export const createUser = async (user: Partial<IUser>) => {
  return await UserModel.create({ user });
};
export const updateUserById = async (userId: string, user: Partial<IUser>) => {
  return await UserModel.findByIdAndUpdate({ _id: userId }, user, {
    new: true,
  });
};
export const deleteUserById = async (userId: string) => {
  return await UserModel.findByIdAndDelete({ _id: userId });
};
