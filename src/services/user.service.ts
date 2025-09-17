import UserModel, { IUser } from "../models/User";

export const findAllUsers = async () => {
  return await UserModel.find();
};
export const findUser = async (data: { username?: string; email?: string }) => {
  let result = null;
  if (data.username) {
    result = await UserModel.find({
      username: data.username?.toString().trim().toLowerCase(),
    });
    return result;
  }
  if (data.email) {
    result = await UserModel.find({
      username: data.email?.toString().trim().toLowerCase(),
    });

    return result;
  }
  return result;
};
export const findUserById = async (userId: number) => {
  return await UserModel.findById({ _id: userId });
};
export const createUser = async (user: Partial<IUser>) => {
  const newUser: Partial<IUser> = {
    name: user.name,
    username: user.username,
    email: user.email,
  };
  const createdUser = await UserModel.create({ newUser });
  return createdUser;
};
export const updateUserById = async (userId: number, user: Partial<IUser>) => {
  const updatedUser = await UserModel.findByIdAndUpdate({ _id: userId }, user, {
    new: true,
  });
  return updatedUser;
};
export const deleteUserById = async (userId: number) => {
  const deletedUser = await UserModel.findByIdAndDelete({ _id: userId });
  return deletedUser;
};
