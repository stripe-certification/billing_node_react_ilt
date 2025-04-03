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
    const userId = SessionsService.getUserId(request);

    if (!userId) throw new Error("User not authenticated");

    const user: User = await UserService.loadUserOrThrow(userId);

    const { prompt, meterEventName } = request.body;

    try {
      const chatResponse = await ChatService.generateLlmResponse(
        prompt,
        user,
        meterEventName
      );

      response.json(chatResponse);
    } catch (error: any) {
      console.error("Error submitting request:", error);
      response.status(500).json({ error });
    }
  }
);

export default router;
