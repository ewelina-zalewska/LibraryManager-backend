import { withAuth } from "#utils/withAuth.ts";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.end();
});

router.post("/", withAuth, (req: Request, res: Response) => {
  const { login } = req;
  const { message } = req.body;

  if (message !== "Logout") return;

  res.clearCookie("token");
  res.json({
    status: "success",
    message: "You have logged out successfully",
    action: message,
    id: login,
  });
});

export default router;
