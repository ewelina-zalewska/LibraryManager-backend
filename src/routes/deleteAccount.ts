import express, { Request, Response } from "express";

import { UsersJSON } from "#types/index.ts";
import { readFile } from "fs";
import { setPassword } from "#utils/setPassword.ts";
import { withAuth } from "#utils/withAuth.ts";

const dataPath: string = "./src/db/users.json";

const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  res.end();
});

type DeleteAccountRequest = {
  password: string;
};

router.post("/", withAuth, (req: Request, res: Response) => {
  const { login } = req;
  const { password }: DeleteAccountRequest = req.body;

  const enteredPassword = setPassword(password, login);

  readFile(dataPath, (err, data) => {
    if (err) throw err;
    const jsonData: UsersJSON = JSON.parse(data.toString());

    const user = Object.values(jsonData.users).find(
      (user) => user.password === enteredPassword
    );

    if (user) {
      return res.status(200).json({
        status: "success",
        message: "The user account will be deleted",
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: `The password is incorrect`,
      });
    }
  });
});

export default router;
