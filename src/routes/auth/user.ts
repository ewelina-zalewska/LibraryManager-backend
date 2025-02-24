import express, { Request, Response } from "express";
import { withAuth } from "#utils/withAuth.ts";

const router = express.Router();

router.get("/", withAuth, function (req: Request, res: Response) {
  const { login } = req;
  const { role } = req;
  const { name } = req;

  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    id: login,
    role,
    name,
  });
});

export default router;
