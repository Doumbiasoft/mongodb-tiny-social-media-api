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
import { HttpStatus } from "../../types/httpStatus";
import {
  validateBody,
  validateParams,
  validateQuery,
  ValidationPatterns,
} from "../../middlewares/validation.middleware";
import { logRequest } from "../../middlewares/logging.middleware";
import { endpointMetadata } from "../../middlewares/endpointMetadata.middleware";
import {
  findAllUsers,
  findUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from "../../services/user.service";
import { findAllPosts, findPostById } from "../../services/post.service";
import { findAllComments } from "../../services/comment.service";
import { buildRoute } from "../../config/apiPrefix";
import { Comments } from "../../models/Comment";

@Router(buildRoute("v1/users"))
class UserController {
  @Get()
  @Use(
    endpointMetadata({
      summary: "Get all users",
      description: "Retrieve a list of all registered users",
    }),
    logRequest()
  )
  async getUsers(@Req _req: Request, @Res res: Response) {
    try {
      const users = await findAllUsers();
      return sendResponse(res, users);
    } catch (error: any) {
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post()
  @Use(
    endpointMetadata({
      summary: "Create a new user",
      description: "Register a new user with name, username, and email",
    }),
    validateBody({
      rules: [
        {
          field: "name",
          required: true,
          type: "string",
          minLength: 3,
          maxLength: 50,
        },
        {
          field: "username",
          required: true,
          type: "string",
          minLength: 3,
          maxLength: 50,
        },
        {
          field: "email",
          required: true,
          type: "string",
          pattern: ValidationPatterns.EMAIL,
        },
      ],
    }),
    logRequest()
  )
  async addUser(@Req req: Request, @Res res: Response) {
    try {
      const body = req.body;
      const user = await createUser(body);
      return sendResponse(res, user);
    } catch (error: any) {
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get("/:id")
  @Use(
    endpointMetadata({
      summary: "Get user by ID",
      description: "Retrieve a specific user by their unique identifier",
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
  async getUserById(@Req req: Request, @Res res: Response) {
    try {
      const userId = req.params.id;
      const user = await findUserById(userId);
      if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
      return sendResponse(res, user);
    } catch (error: any) {
      if (error.name === "CastError") {
        return sendError(res, "Invalid user id", HttpStatus.BAD_REQUEST);
      }
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get("/:id/posts")
  @Use(
    endpointMetadata({
      summary: "Get user posts",
      description: "Retrieve all posts created by a specific user",
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
  async getUserPosts(@Req req: Request, @Res res: Response) {
    try {
      const userId = req.params.id;
      const user = await findUserById(userId);
      if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
      const posts = await findAllPosts(userId);
      return sendResponse(res, posts);
    } catch (error: any) {
      if (error.name === "CastError") {
        return sendError(res, "Invalid user id", HttpStatus.BAD_REQUEST);
      }
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get("/:id/comments")
  @Use(
    endpointMetadata({
      summary: "Get user comments",
      description:
        "Retrieve all comments made by a specific user, optionally filtered by post ID",
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
          field: "postId",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async getUserComments(@Req req: Request, @Res res: Response) {
    try {
      let comments: Comments = [];
      const userId = req.params.id;
      const user = await findUserById(userId);
      if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);

      if (req.query.postId) {
        const postId = req.query.postId.toString();
        const post = await findPostById(postId);
        if (!post)
          return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
        comments = await findAllComments({ userId, postId });
        return sendResponse(res, comments);
      }
      comments = await findAllComments({ userId });
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
      summary: "Update user",
      description: "Update an existing user's name, email, or username",
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
          field: "name",
          required: false,
          type: "string",
        },
        {
          field: "email",
          required: false,
          type: "string",
        },
        {
          field: "username",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async updateUser(@Req req: Request, @Res res: Response) {
    try {
      if (req.params.id !== req.body.id)
        return sendError(
          res,
          "Resource to update not found",
          HttpStatus.BAD_REQUEST
        );
      const userId = req.params.id;
      const user = await findUserById(userId);
      if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
      const updatedUser = await updateUserById(userId, req.body);
      return sendResponse(res, updatedUser);
    } catch (error: any) {
      if (error.name === "CastError") {
        return sendError(res, "Invalid user id", HttpStatus.BAD_REQUEST);
      }
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Delete("/:id")
  @Use(
    endpointMetadata({
      summary: "Delete user",
      description: "Delete a specific user by their unique identifier",
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
  async deleteUser(@Req req: Request, @Res res: Response) {
    try {
      const userId = req.params.id;
      const user = await findUserById(userId);
      if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
      const deletedUser = await deleteUserById(userId);
      return sendResponse(res, deletedUser);
    } catch (error: any) {
      if (error.name === "CastError") {
        return sendError(res, "Invalid user id", HttpStatus.BAD_REQUEST);
      }
      return sendError(res, error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export { UserController };
