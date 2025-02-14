import express, { Request, Response } from "express";

import { User, UserRequest, UsersJSON } from "#types/index.ts";
import { readFile, writeFile } from "fs";
import { setCardNumber } from "#utils/setCardNumber.ts";
import { setPassword } from "#utils/setPassword.ts";

const dataPath: string = "./src/db/users.json";
const FIND_USER = (users: User[], email: string) =>
  Object.values(users).some((user) => user.email === email);

const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  res.end();
});

router.post("/", (req: Request, res: Response) => {
  const { username, email, password }: UserRequest = req.body;

  readFile(dataPath, (err, data) => {
    if (err) throw err;
    const jsonData: UsersJSON = JSON.parse(data.toString());
    const userExists = FIND_USER(jsonData.users, email);

    if (userExists)
      return res.json({
        status: "fail",
        message: "Given email exists.",
      });

    const cardNo = setCardNumber(username);
    const hashedPassword = setPassword(password, cardNo);

    const newUser: User = {
      id: cardNo,
      username,
      email,
      password: hashedPassword,
      bookId: [],
    };

    jsonData.users.push(newUser);
    writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        throw err;
      }
      res.json({
        status: "success",
        message: "Registration was successful",
        action: "Registration",
        id: cardNo,
      });
    });
  });
});

export default router;
