import { Router, Request, Response } from "express";
import { offeringsService } from "../services/offerings";

const router = Router();

/**
 * Looks up a price based on a lookup key.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} response - A JSON object including the price object.
 *
 */
router.get("/offerings", async (req: Request, res: Response) => {
  try {
    const offerings = await offeringsService.getLlmOfferings();
    if (!offerings) throw new Error("No offerings found");

    res.json(offerings);
  } catch (error: any) {
    console.error("Error retrieving offerings:", error);
    res.status(500).json({ error });
  }
});

export default router;
