import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { User, PortalAction, CustomRequest } from "../types/users";
import { UserService } from "../services/users";
import SessionsService from "../services/sessions";
const router = Router();

router.post(
  "/users/login",
  body("email").isEmail().normalizeEmail(),
  async (request: CustomRequest, response: Response, next: NextFunction) => {
    const email = request.body.email;
  },
  SessionsService.create,
  async (request: Request, response: Response) => {
    try {
      const userId = SessionsService.getUserId(request);

      const user = await UserService.loadUserOrThrow(userId as string);
      response.send(user);
    } catch (error: any) {
      console.error("Error fetching user:", error);
      return response.status(500).json({ error });
    }
  }
);

router.post("/users/logout", async (request: Request, response: Response) => {
  try {
    SessionsService.clear(request, response);
  } catch (error: any) {
    console.error("Error logging out user:", error);
    return response.status(500).json({ error });
  }
});

router.post(
  "/users",
  body("email").isEmail().normalizeEmail(),
  async (request: CustomRequest, response: Response, next: NextFunction) => {
    const email: string = request.body.email;

    try {
      if (!email) {
        return response
          .status(400)
          .json({ error: { message: "Email is required" } });
      }

      const params = { email };
      const user = await UserService.createUser(params);
      if (!user) {
        return response
          .status(500)
          .json({ error: { message: "User not created" } });
      }

      request.userId = user.id;
      next();
    } catch (error: any) {
      console.error("Error creating user:", error);
      return response.status(500).json({ error });
    }
  },
  SessionsService.create,
  async (request: CustomRequest, response: Response) => {
    try {
      if (!request.session.user) {
        return response
          .status(500)
          .json({ error: { message: "User missing from session" } });
      }

      const user = await UserService.loadUserOrThrow(request.userId as string);
      response.send({ id: user.id, email: user.email, status: user.status });
    } catch (error: any) {
      console.error("Error fetching user:", error);
      return response.status(500).json({ error });
    }
  }
);

router.get("/users", async (request: Request, response: Response) => {
  const userId = SessionsService.getUserId(request);

  if (!userId) {
    return response.send({ user: null });
  }

  const user = await UserService.loadUserOrThrow(userId as string);
  response.send({ id: user.id, email: user.email, status: user.status });
});

/*
 * Create a redirect URL to the hosted Customer Portal.
 * The action parameter specifies a deep link.
 */
router.post(
  "/users/manage",
  SessionsService.isAuthenticated,
  async (request, response) => {
    const action = request.body.action;
    const userId = SessionsService.getUserId(request);

    try {
      const session = await UserService.getCustomerPortalSession({
        userId: userId as string,
        action: action as PortalAction,
      });

      response.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating billing portal session:", error);
      response.status(500).json({ error });
    }
  }
);

export default router;
