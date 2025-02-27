import express, { Request, Response } from "express";
import { readFile, writeFile } from "fs";
import {
  BorrowedBook,
  BorrowedBookRequest,
  BorrowedBooksJSON,
  BorrowRequest,
  NoticeRequest,
} from "#types/index.ts";
import { withAuth } from "#utils/withAuth.ts";
import { setRandomId } from "#utils/setRadnomId.ts";
import { setTime } from "#utils/setTime.ts";

const filePath = "./src/db/borrowedBooks.json";

const router = express.Router();

const HANDLE_ERROR_404 = (
  res: Response,
  element: BorrowedBook | undefined,
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
  readFile(filePath, (err, data) => {
    if (err) console.log(err);
    const jsonData: BorrowedBooksJSON = JSON.parse(data.toString());
    res.json(jsonData);
  });
});

router.get("/:id", (req: Request, res: Response) => {
  const { id: bookID } = req.params;
  readFile(filePath, (err, data) => {
    if (err) throw err;
    const jsonData: BorrowedBooksJSON = JSON.parse(data.toString());
    const { borrowedBooks } = jsonData;
    const book = Object.values(borrowedBooks).find(
      (book) => book.id === bookID
    );

    HANDLE_ERROR_404(res, book, bookID);
    res.json(book);
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

router.patch("/:id", (req: Request, res: Response) => {
  const { id: bookID } = req.params;

  readFile(filePath, (err, data) => {
    if (err) throw err;
    const jsonData: BorrowedBooksJSON = JSON.parse(data.toString());
    const { borrowedBooks } = jsonData;
    const book = Object.values(borrowedBooks).find(
      (book) => book.id === bookID
    );

    const { notice }: NoticeRequest = req.body;

    if (book) {
      Object.assign(book, { notice });

      const JSONdata = JSON.stringify(borrowedBooks, null, 2);
      writeFile(filePath, `{"borrowedBooks": ${JSONdata}}`, (err) => {
        if (err) {
          return res.status(500).json({
            status: "fail",
            message: "The notice has not been added.",
          });
        }

        res.status(200).json({
          status: "success",
          message: "The notice has been added",
        });
      });
    }
  });
});

router.put("/:id", (req: Request, res: Response) => {
  const { id: bookID } = req.params;

  readFile(filePath, (err, data) => {
    if (err) throw err;
    const {
      id,
      status,
      userId,
      bookId,
      title,
      author,
      releaseDate,
      borrowed_on,
      borrowed_at,
      returned_on,
      returned_at,
      deadline,
      deadlineExceeded,
      notice,
    }: BorrowedBookRequest = req.body;

    if (!bookID)
      return res.status(200).json({
        status: "fail",
        message: "there is no book to update",
      });

    const jsonData: BorrowedBooksJSON = JSON.parse(data.toString());
    const { borrowedBooks } = jsonData;
    const book = Object.values(borrowedBooks).find(
      (book) => book.id === bookID
    );

    if (book) {
      const updatedBook = {
        id,
        status,
        userId,
        bookId,
        title,
        author,
        releaseDate,
        borrowed_on,
        borrowed_at,
        returned_on,
        returned_at,
        deadline,
        deadlineExceeded,
        notice,
      };
      Object.assign(book, updatedBook);

      const JSONdata = JSON.stringify(borrowedBooks, null, 2);
      writeFile(filePath, `{"borrowedBooks": ${JSONdata}}`, (err) => {
        if (err) {
          return res.status(500).json({
            status: "fail",
            message: "The book data has not been changed.",
          });
        }

        res.status(200).json({
          status: "success",
          message: "The book data has not been changed successfully",
          action: "Update book",
          bookId: bookID,
        });
      });
    }
  });
});

export default router;
