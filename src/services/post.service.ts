import PostModel, { IPost } from "../models/Post";

export const findAllPosts = async (userId?: string) => {
  const filter: any = {};
  if (userId) {
    filter.userId = userId;
  }
  return await PostModel.find(filter);
};
export const findPostById = async (postId: string) => {
  return await PostModel.findById({ _id: postId });
};
export const createPost = async (post: Partial<IPost>) => {
  return await PostModel.create({ post });
};
export const updatePostById = async (postId: string, post: Partial<IPost>) => {
  return await PostModel.findByIdAndUpdate({ _id: postId }, post, {
    new: true,
  });
};
export const deletePostById = async (postId: string) => {
  return await PostModel.findByIdAndDelete({ _id: postId });
};
