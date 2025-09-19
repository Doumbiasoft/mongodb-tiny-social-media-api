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
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation.middleware";
import { endpointMetadata } from "../../middlewares/endpointMetadata.middleware";
import {
  createPost,
  deletePostById,
  findAllPosts,
  findPostById,
  updatePostById,
} from "../../services/post.service";
import { findUserById } from "../../services/user.service";
import { findAllComments } from "../../services/comment.service";
import { buildRoute } from "../../config/apiPrefix";
import { Posts } from "../../models/Post";
import { Comments } from "../../models/Comment";

@Router(buildRoute("v1/posts"))
class PostController {
  @Get()
  @Use(
    endpointMetadata({
      summary: "Get all posts",
      description:
        "Retrieve a list of all posts, optionally filtered by user ID",
    }),
    validateQuery({
      rules: [
        {
          field: "userId",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async getPosts(@Req req: Request, @Res res: Response) {
    try {
      let posts: Posts = [];
      if (req.query.userId) {
        const userId = req.query.userId.toString();
        const user = await findUserById(userId);
        if (!user)
          return sendError(res, "User not found", HttpStatus.NOT_FOUND);
        posts = await findAllPosts(userId);
        return sendResponse(res, posts);
      } else {
        posts = await findAllPosts();
        return sendResponse(res, posts);
      }
    } catch (error: any) {
      if (error.name === "CastError") {
        return sendError(res, "Invalid user id", HttpStatus.BAD_REQUEST);
      }
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post()
  @Use(
    endpointMetadata({
      summary: "Create a new post",
      description:
        "Create a new post with title and content for a specific user",
    }),
    validateBody({
      rules: [
        {
          field: "userId",
          required: true,
          type: "string",
        },
        {
          field: "title",
          required: true,
          type: "string",
        },
        {
          field: "content",
          required: true,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async addPost(@Req req: Request, @Res res: Response) {
    try {
      const post = await createPost(req.body);
      return sendResponse(res, post);
    } catch (error: any) {
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get("/:id")
  @Use(
    endpointMetadata({
      summary: "Get post by ID",
      description: "Retrieve a specific post by its unique identifier",
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
  async getPostById(@Req req: Request, @Res res: Response) {
    try {
      const postId = req.params.id;
      const post = await findPostById(postId);
      if (!post) return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
      return sendResponse(res, post);
    } catch (error: any) {
      if (error.name === "CastError") {
        return sendError(res, "Invalid post id", HttpStatus.BAD_REQUEST);
      }
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get("/:id/comments")
  @Use(
    endpointMetadata({
      summary: "Get post comments",
      description:
        "Retrieve all comments for a specific post, optionally filtered by user ID",
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
    validateQuery({
      rules: [
        {
          field: "userId",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async getPostComments(@Req req: Request, @Res res: Response) {
    try {
      let comments: Comments = [];
      const postId = req.params.id;
      const post = await findPostById(postId);
      if (!post) return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
      if (req.query.userId) {
        const userId = req.query.userId.toString();
        const user = await findUserById(userId);
        if (!user)
          return sendError(res, "User not found", HttpStatus.NOT_FOUND);
        comments = await findAllComments({ userId, postId });
        return sendResponse(res, comments);
      }
      comments = await findAllComments({ postId });
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

  @Patch("/:id")
  @Use(
    endpointMetadata({
      summary: "Update post",
      description: "Update an existing post's title and/or content",
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
          field: "title",
          required: false,
          type: "string",
        },
        {
          field: "content",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async updatePost(@Req req: Request, @Res res: Response) {
    try {
      if (req.params.id !== req.body.id)
        return sendError(
          res,
          "Resource to update not found",
          HttpStatus.BAD_REQUEST
        );
      const updatedPost = await updatePostById(req.params.id, req.body);
      return sendResponse(res, updatedPost);
    } catch (error: any) {
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Delete("/:id")
  @Use(
    endpointMetadata({
      summary: "Delete post",
      description: "Delete a specific post by its unique identifier",
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
  async deletePost(@Req req: Request, @Res res: Response) {
    try {
      const postId = req.params.id;
      const post = await findPostById(postId);
      if (!post) return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
      const deletedPost = await deletePostById(postId);
      return sendResponse(res, deletedPost);
    } catch (error: any) {
      if (error.name === "CastError") {
        return sendError(res, "Invalid post id", HttpStatus.BAD_REQUEST);
      }
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export { PostController };
