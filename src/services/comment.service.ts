import CommentModel, { IComment } from "../models/Comment";

export const findAllComments = async (data: {
  userId?: string;
  postId?: string;
}) => {
  const filter: any = {};
  if (data?.userId && data?.postId) {
    filter.userId = data?.userId;
    filter.postId = data?.postId;
  }
  if (data?.userId) {
    filter.userId = data?.userId;
  }
  if (data?.postId) {
    filter.postId = data?.postId;
  }
  return await CommentModel.find(filter);
};

export const findCommentById = async (commentId: string) => {
  return await CommentModel.findById({ _id: commentId });
};

export const createComment = async (comment: Partial<IComment>) => {
  return await CommentModel.create(comment);
};
export const updateCommentById = async (
  commentId: string,
  comment: Partial<IComment>
) => {
  return await CommentModel.findByIdAndUpdate({ _id: commentId }, comment, {
    new: true,
    runValidators: true,
  });
};
export const deleteCommentById = async (commentId: string) => {
  return await CommentModel.findByIdAndDelete({ _id: commentId });
};
