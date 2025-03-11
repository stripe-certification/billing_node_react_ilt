import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/users";

declare module "express-session" {
  export interface SessionData {
    user?: { id: string };
  }
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.user) next();
  else next("route");
}

export function create(req: CustomRequest, res: Response, next: NextFunction) {
  if (req.session.user) {
    return next();
  }

  const userId: string = req.userId as string;

  req.session.user = { id: userId };

  req.session.save((err) => {
    if (err) {
      console.error("❌ Session save error:", err);
      return next(err);
    }
    console.log("✅ New session saved:", req.session);
    next();
  });
}

export function clear(req: Request, res: Response) {
  if (!req.session) {
    console.log("⚠️ No session found to destroy.");
    return res.status(400).json({ error: "No active session" });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Error destroying session:", err);
      return res.status(500).json({ error: "Failed to clear session" });
    }

    console.log("✅ Session destroyed successfully");
    res.clearCookie("connect.sid");
    return res.json({ message: "Session cleared" });
  });
}

export function getUserId(req: Request) {
  if (req.session.user) {
    return req.session.user.id;
  }
  return null;
}

export const SessionsService = {
  isAuthenticated,
  create,
  clear,
  getUserId,
};

export default SessionsService;
