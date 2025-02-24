import fs from "fs";
import express, { Request, Response } from "express";
import { readFile } from "fs";
import { Book } from "#types/index.ts";

const filePath = "./src/db/books.json";

const FIND_BOOK = (books: Book[], id: string) =>
  Object.values(books).find((book) => book.id === id);

const HANDLE_ERROR_404 = (
  res: Response,
  element: Book | undefined,
  id: string
) => {
  if (!element) {
    return res.status(404).json({
      status: "fail",
      message: `No book with the ID of ${id}`,
    });
  }
};

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  readFile(filePath, (err, data) => {
    if (err) throw err;
    const jsonData: Book[] = JSON.parse(data.toString());
    res.json(jsonData);
  });
});

router.get("/:id", (req: Request, res: Response) => {
  const { id: bookID } = req.params;
  readFile(filePath, (err, data) => {
    if (err) throw err;
    const books: Book[] = JSON.parse(data.toString());
    const book = FIND_BOOK(books, bookID);
    HANDLE_ERROR_404(res, book, bookID);
    res.json(book);
  });
});

router.patch("/:id", (req: Request, res: Response) => {
  const { id: bookID } = req.params;

  readFile(filePath, (err, data) => {
    if (err) throw err;
    const { body } = req;

    if (body.copies < 0)
      return res.status(200).json({
        status: "fail",
        message: "there is no book to borrow",
      });

    const books: Book[] = JSON.parse(data.toString());
    const book = FIND_BOOK(books, bookID);

    if (book) {
      Object.assign(book, body);

      fs.writeFile(filePath, JSON.stringify(books, null, 2), (err) => {
        if (err) {
          return res.status(500).json({
            status: "fail",
            message: "The book could not be borrowed.",
          });
        }

        res.status(200).json({
          status: "success",
          message: "The book has been successfully borrowed",
          action: "Borrowing a book",
          bookId: book.id,
          data: {
            books: book,
          },
        });
      });
    }
  });
});
export default router;
