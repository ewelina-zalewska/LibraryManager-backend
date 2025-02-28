import { readFile, writeFile } from "fs";
import express, { Request, Response } from "express";
import {
  Book,
  BookRequest,
  BooksJSON,
  NumberOfCopiesRequest,
} from "#types/index.ts";
import { setRandomId } from "#utils/setRadnomId.ts";

const filePath = "./src/db/books.json";

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
    const jsonData: { books: Book[] } = JSON.parse(data.toString());
    res.json(jsonData);
  });
});

router.get("/:id", (req: Request, res: Response) => {
  const { id: bookID } = req.params;
  readFile(filePath, (err, data) => {
    if (err) throw err;
    const booksObject: { books: Book[] } = JSON.parse(data.toString());
    const { books } = booksObject;
    const book = Object.values(books).find((book) => book.id === bookID);

    HANDLE_ERROR_404(res, book, bookID);
    res.json(book);
  });
});

router.patch("/:id", (req: Request, res: Response) => {
  const { id: bookID } = req.params;

  readFile(filePath, (err, data) => {
    if (err) throw err;
    const booksObject: { books: Book[] } = JSON.parse(data.toString());
    const { books } = booksObject;
    const book = Object.values(books).find((book) => book.id === bookID);

    const { copies, numberOfborrowedBooks }: NumberOfCopiesRequest = req.body;

    if (copies < 0)
      return res.status(200).json({
        status: "fail",
        message: "there is no book to borrow",
      });

    if (book) {
      Object.assign(book, { copies, numberOfborrowedBooks });

      const JSONdata = JSON.stringify(books, null, 2);
      writeFile(filePath, `{"books": ${JSONdata}}`, (err) => {
        if (err) {
          return res.status(500).json({
            status: "fail",
            message: "The number of copies has not changed",
          });
        }

        res.status(200).json({
          status: "success",
          message: "The number of copies has changed",
        });
      });
    }
  });
});

router.put("/:id", (req: Request, res: Response) => {
  const { id: bookID } = req.params;

  readFile(filePath, (err, data) => {
    if (err) throw err;
    const { title, author, copies, description, releaseDate }: BookRequest =
      req.body;

    if (!bookID)
      return res.status(200).json({
        status: "fail",
        message: "there is no book to update",
      });

    const booksObject: { books: Book[] } = JSON.parse(data.toString());
    const { books } = booksObject;
    const book = Object.values(books).find((book) => book.id === bookID);

    if (book) {
      const updatedBook = {
        id: book.id,
        title,
        author,
        copies,
        description,
        releaseDate,
        numberOfborrowedBooks: book.numberOfborrowedBooks,
      };
      Object.assign(book, updatedBook);

      const JSONdata = JSON.stringify(books, null, 2);
      writeFile(filePath, `{"books": ${JSONdata}}`, (err) => {
        if (err) {
          return res.status(500).json({
            status: "fail",
            message: "The book has not been updated.",
          });
        }

        res.status(200).json({
          status: "success",
          message: "The book has been updated successfully",
          action: "Update book",
          bookId: bookID,
        });
      });
    }
  });
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id: bookID } = req.params;

  readFile(filePath, (err, data) => {
    if (err) throw err;
    const booksObject: { books: Book[] } = JSON.parse(data.toString());

    const { books } = booksObject;
    const bookIndex = books.findIndex((book) => book.id === bookID);
  

    if (bookIndex < 0)
      return res.status(404).json({
        status: "fail",
        message: "Item cannot be found",
      });
    books.splice(bookIndex, 1);
    // delete books[bookIndex];
    const JSONdata = JSON.stringify(books, null, 2);

    writeFile(filePath, `{"books": ${JSONdata}}`, (err) => {
      if (err) {
        return res.status(500).json({
          status: "fail",
          message: "Item cannot be deleted",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Item has been removed successfully",
        action: "Delete books",
        bookId: bookID,
        data: books,
      });
    });
  });
});

router.post("/", (req: Request, res: Response) => {
  const { title, author, copies, description, releaseDate }: BookRequest =
    req.body;

  readFile(filePath, (err, data) => {
    if (err) throw err;
    const jsonData: BooksJSON = JSON.parse(data.toString());

    const newBookId = setRandomId().toString();

    const newBook: Book = {
      id: newBookId,
      title,
      author,
      copies,
      description,
      releaseDate,
      numberOfborrowedBooks: 0,
    };

    jsonData.books.push(newBook);
    writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        throw err;
      }
      res.json({
        status: "success",
        message: "The book has been successfully adde",
        action: "Adding a book",
        bookId: newBookId,
      });
    });
  });
});
export default router;
