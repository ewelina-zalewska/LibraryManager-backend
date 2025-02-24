import { NextFunction, Request, Response } from "express";

export const verifyRole = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req;
    if (role?.toLowerCase() !== "admin") {
      res.status(401).json({
        status: "failed",
        message: "You are not authorized to view this page.",
      });
    } else if (role.toLowerCase() === "admin") next();
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
