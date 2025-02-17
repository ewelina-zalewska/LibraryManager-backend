import express, { Request, Response } from "express";

import { Log, LogRequest, LogsJSON, User } from "#types/index.ts";
import { readFile, writeFile } from "fs";
import { setRandomId } from "#utils/setRadnomId.ts";

const dataPath: string = "./src/db/logs.json";

const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  readFile(dataPath, (err, data) => {
    if (err) throw err;
    const jsonData: Log[] = JSON.parse(data.toString());
    res.json(jsonData);
  });
});

router.post("/", (req: Request, res: Response) => {
  const { action, created_on, created_at, userID }: LogRequest = req.body;

  readFile(dataPath, (err, data) => {
    if (err) throw err;
    const jsonData: LogsJSON = JSON.parse(data.toString());
    const id = setRandomId().toString();

    const newLog: Log = {
      id,
      action,
      created_on,
      created_at,
      userID,
    };

    jsonData.logs.push(newLog);
    writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        throw err;
      }
      res.json({
        status: "success",
        message: "Log has been added successful",
      });
    });
  });
});

export default router;
