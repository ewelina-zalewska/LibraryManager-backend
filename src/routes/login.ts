import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { LoginRequest, UsersJSON } from "#types/index.ts";
import { getData } from "../config/getData.ts";
import { readFile } from "fs";
import { setPassword } from "#utils/setPassword.ts";
import { validateUser } from "#utils/validateUser.ts";

const dataPath: string = "./src/db/users.json";

const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  res.end();
});

router.post("/", (req: Request, res: Response) => {
  const { login, password }: LoginRequest = req.body;
  const enteredPassword = setPassword(password, login);

  readFile(dataPath, (err, data) => {
    if (err) throw err;
    const jsonData: UsersJSON = JSON.parse(data.toString());

    const { loginExists, passwordExists } = validateUser({
      jsonData,
      login,
      enteredPassword,
    });

    if (!loginExists || !passwordExists) {
      return res.json({
        status: "fail",
        message: "Incorrect login or password.",
      });
    }

    const user = Object.values(jsonData.users).find(
      (user) => user.id === login
    );
    if (!user) return;
    const role = user.role;
    const name = user.username;

    const token = jwt.sign(
      { login, role, name },
      getData().SECRET_ACCESS_TOKEN
    );
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.json({
      status: "success",
      message: "Logged in successfully",
      action: "Login",
      id: login,
      role,
    });
  });
});

export default router;
