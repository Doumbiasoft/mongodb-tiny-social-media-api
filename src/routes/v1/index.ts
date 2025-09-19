import { Application } from "express";
import { register } from "@reflet/express";
import { setApiPrefix } from "../../config/apiPrefix";
import { UserController } from "../../controllers/v1/user.controller";
import { PostController } from "../../controllers/v1/post.controller";
import { CommentController } from "../../controllers/v1/comment.controller";

/**
 * Register all v1 API controllers with dynamic prefix
 */
export function registerV1Routes(app: Application, apiPrefix: string): void {
  // Set the API prefix before register routes
  setApiPrefix(apiPrefix);
  register(app, [UserController, PostController, CommentController]);
}
