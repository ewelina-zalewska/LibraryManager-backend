import express, { Request, Response } from "express";
import { readFile, writeFile } from "fs";
import {
  BorrowedBook,
  BorrowedBooksJSON,
  BorrowRequest,
} from "#types/index.ts";
import { withAuth } from "#utils/withAuth.ts";
import { setRandomId } from "#utils/setRadnomId.ts";
import { setTime } from "#utils/setTime.ts";

const filePath = "./src/db/borrowedBooks.json";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  readFile(filePath, (err, data) => {
    if (err) console.log(err);
    const jsonData: BorrowedBook[] = JSON.parse(data.toString());
    res.json(jsonData);
  });
});

router.post("/", withAuth, (req: Request, res: Response) => {
  const { login } = req;
  const { status, bookId, title, author, releaseDate }: BorrowRequest =
    req.body;

  if (!login) return;
  readFile(filePath, (err, data) => {
    if (err) throw err;
    const jsonData: BorrowedBooksJSON = JSON.parse(data.toString());

    const borrowedBookId = setRandomId().toString();
    const { currentDate, currentTime, deadlineDate } = setTime();
    const newBorrowedBook: BorrowedBook = {
      id: borrowedBookId,
      status,
      userId: login,
      bookId,
      title,
      author,
      releaseDate,
      borrowed_on: currentDate,
      borrowed_at: currentTime,
      returned_on: null,
      returned_at: null,
      deadline: deadlineDate,
      deadlineExceeded: false,
      notice: false,
    };

    jsonData.borrowedBooks.push(newBorrowedBook);
    writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        throw err;
      }
      res.json({
        status: "success",
        message: "The book has been successfully borrowed",
        action: "Borrowing a book",
        bookId,
      });
    });
  });
});
export default router;
