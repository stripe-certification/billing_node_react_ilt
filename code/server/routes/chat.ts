import { Router, Request, Response } from "express";
import { ChatService } from "../services/chat";
import { SessionsService } from "../services/sessions";
import { UserService } from "../services/users";
import { User } from "../types/users";

const router = Router();

router.post(
  "/chat",
  SessionsService.isAuthenticated,
  async (request: Request, response: Response) => {
    // Training TODO: Record the user's usage of the LLM. 
  }
);

export default router;
