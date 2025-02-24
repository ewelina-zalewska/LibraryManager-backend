import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getData } from "../config/getData.ts";

export interface TokenInterface {
  login: string;
  role: string;
  name: string;
  iat: number;
}
export const withAuth = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  const { SECRET_ACCESS_TOKEN } = getData();

  if (!token) {
    res.status(401).json({
      status: "fail",
      message: "Unauthorized: Invalid token",
    });
  } else {
    jwt.verify(
      token,
      SECRET_ACCESS_TOKEN,
      (err: NodeJS.ErrnoException | null, decoded?: object | string) => {
        if (err) {
          res.status(401).json({
            status: "fail",
            message: "Unauthorized: Invalid token",
          });
        } else {
          const token = decoded;
          const { role, login, name } = token as TokenInterface;
          req.role = role;
          req.login = login;
          req.name = name;
          next();
        }
      }
    );
  }
};
