import express, { Request, Response } from "express";

import { User, UserRequest, UsersJSON } from "#types/index.ts";
import { readFile, writeFile } from "fs";
import { setCardNumber } from "#utils/setCardNumber.ts";
import { setPassword } from "#utils/setPassword.ts";
import { withAuth } from "#utils/withAuth.ts";
import { getData } from "../config/getData.ts";

const { ADMIN_CODE } = getData();
const dataPath: string = "./src/db/users.json";
const FIND_USER = (users: User[], data: string) =>
  Object.values(users).some((user) => user.email === data);

const router = express.Router();

const HANDLE_ERROR_404 = (
  res: Response,
  element: User | undefined,
  id: string
) => {
  if (!element) {
    return res.status(404).json({
      status: "fail",
      message: `No book with the ID of ${id}`,
    });
  }
};

router.get("/", (req: Request, res: Response) => {
  res.end();
});

router.get("/:id", withAuth, (req: Request, res: Response) => {
  const { id: userId } = req.params;

  readFile(dataPath, (err, data) => {
    if (err) throw err;
    const jsonData: UsersJSON = JSON.parse(data.toString());
    const { users } = jsonData;
    const user = Object.values(users).find((user) => user.id === userId);
    HANDLE_ERROR_404(res, user, userId);
    res.json(user);
  });
});

router.post("/", (req: Request, res: Response) => {
  const { username, email, password, accessCode }: UserRequest = req.body;

  const role = accessCode === ADMIN_CODE ? "admin" : "user";

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
      role,
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

router.delete("/:id", (req: Request, res: Response) => {
  const { id: userId } = req.params;
  res.clearCookie("token");
  readFile(dataPath, (err, data) => {
    if (err) throw err;
    const jsonData: UsersJSON = JSON.parse(data.toString());

    const userIndex = jsonData.users.findIndex((user) => user.id === userId);

    if (userIndex < 0)
      return res.status(404).json({
        status: "fail",
        message: "User cannot be found",
      });

    jsonData.users.splice(userIndex, 1);

    writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({
          status: "fail",
          message: "The user account cannot be deleted",
        });
      }

      res.status(200).json({
        status: "success",
        message: "The user account has been deleted successfully",
        data: jsonData.users[userIndex],
      });
    });
  });
});
export default router;
