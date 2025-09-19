import { Request, Response } from "express";
import { sendResponse, sendError } from "../../utils/apiResponseFormat";
import {
  Router,
  Get,
  Post,
  Delete,
  Patch,
  Use,
  Req,
  Res,
} from "@reflet/express";
import { logRequest } from "../../middlewares/logging.middleware";
import { HttpStatus } from "../../types/httpStatus";
import { endpointMetadata } from "../../middlewares/endpointMetadata.middleware";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation.middleware";
import { findUserById } from "../../services/user.service";
import {
  createComment,
  deleteCommentById,
  findAllComments,
  findCommentById,
  updateCommentById,
} from "../../services/comment.service";
import { findPostById } from "../../services/post.service";
import { buildRoute } from "../../config/apiPrefix";
import { Comments } from "../../models/Comment";

@Router(buildRoute("v1/comments"))
class CommentController {
  @Get()
  @Use(
    endpointMetadata({
      summary: "Get all comments",
      description:
        "Retrieve comments, optionally filtered by user ID and/or post ID",
    }),
    validateQuery({
      rules: [
        {
          field: "userId",
          required: false,
          type: "string",
        },
        {
          field: "postId",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async getComments(@Req req: Request, @Res res: Response) {
    try {
      let comments: Comments = [];
      if (req.query.userId && req.query.postId) {
        const userId = req.query.userId.toString();
        const user = await findUserById(userId);
        if (!user)
          return sendError(res, "User not found", HttpStatus.NOT_FOUND);
        const postId = req.query.postId.toString();
        const post = await findPostById(postId);
        if (!post)
          return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
        comments = await findAllComments({ userId, postId });
        return sendResponse(res, comments);
      }
      if (req.query.userId) {
        const userId = req.query.userId.toString();
        const user = await findUserById(userId);
        if (!user)
          return sendError(res, "User not found", HttpStatus.NOT_FOUND);
        comments = await findAllComments({ userId });
        return sendResponse(res, comments);
      }
      if (req.query.postId) {
        const postId = req.query.postId.toString();
        const post = await findPostById(postId);
        if (!post)
          return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
        comments = await findAllComments({ postId });
        return sendResponse(res, comments);
      }
      comments = await findAllComments({});
      return sendResponse(res, comments);
    } catch (error: any) {
      if (error.name === "CastError") {
        return sendError(
          res,
          "Invalid user or post id",
          HttpStatus.BAD_REQUEST
        );
      }
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post()
  @Use(
    endpointMetadata({
      summary: "Create a new comment",
      description: "Add a new comment to a specific post by a specific user",
    }),
    validateBody({
      rules: [
        {
          field: "userId",
          required: true,
          type: "string",
        },
        {
          field: "postId",
          required: true,
          type: "string",
        },
        {
          field: "body",
          required: true,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async addComment(@Req req: Request, @Res res: Response) {
    try {
      const comment = await createComment(req.body);
      return sendResponse(res, comment);
    } catch (error: any) {
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get("/:id")
  @Use(
    endpointMetadata({
      summary: "Get comment by ID",
      description: "Retrieve a specific comment by its unique identifier",
    }),
    validateParams({
      rules: [
        {
          field: "id",
          required: true,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async getCommentById(@Req req: Request, @Res res: Response) {
    try {
      const commentId = req.params.id;
      const comment = await findCommentById(commentId);
      if (!comment)
        return sendError(res, "Comment not found", HttpStatus.NOT_FOUND);
      return sendResponse(res, comment);
    } catch (error: any) {
      if (error.name === "CastError") {
        return sendError(res, "Invalid comment id", HttpStatus.BAD_REQUEST);
      }
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Patch("/:id")
  @Use(
    endpointMetadata({
      summary: "Update comment",
      description: "Update the content of an existing comment",
    }),
    validateParams({
      rules: [
        {
          field: "id",
          required: true,
          type: "string",
        },
      ],
    }),
    validateBody({
      rules: [
        {
          field: "id",
          required: true,
          type: "string",
        },
        {
          field: "body",
          required: true,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async updateComment(@Req req: Request, @Res res: Response) {
    try {
      if (req.params.id !== req.body.id)
        return sendError(
          res,
          "Resource to update not found",
          HttpStatus.BAD_REQUEST
        );
      const updatedComment = await updateCommentById(req.params.id, req.body);
      return sendResponse(res, updatedComment);
    } catch (error: any) {
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Delete("/:id")
  @Use(
    endpointMetadata({
      summary: "Delete comment",
      description: "Delete a specific comment by its unique identifier",
    }),
    validateParams({
      rules: [
        {
          field: "id",
          required: true,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async deleteComment(@Req req: Request, @Res res: Response) {
    try {
      const commentId = req.params.id;
      const comment = await findCommentById(commentId);
      if (!comment)
        return sendError(res, "Comment not found", HttpStatus.NOT_FOUND);
      const deletedComment = await deleteCommentById(commentId);
      return sendResponse(res, deletedComment);
    } catch (error: any) {
      if (error.name === "CastError") {
        return sendError(res, "Invalid comment id", HttpStatus.BAD_REQUEST);
      }
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export { CommentController };
