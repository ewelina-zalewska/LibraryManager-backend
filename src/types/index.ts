declare global {
  namespace Express {
    interface Request {
      role?: string;
      login?: string;
      name?: string;
    }
  }
}

//Book
export interface Book {
  id: string;
  title: string;
  author: string;
  copies: number;
  description: string;
  releaseDate: string;
  numberOfborrowedBooks: number;
}

export interface BookRequest {
  title: string;
  author: string;
  copies: number;
  description: string;
  releaseDate: string;
}

export interface NumberOfCopiesRequest {
  copies: number;
  numberOfborrowedBooks: number;
}

export interface NoticeRequest {
  notice: boolean;
}

export interface BorrowRequest {
  status: "Borrowed";
  bookId: string;
  title: string;
  author: string;
  releaseDate: string;
}

export interface BorrowedBook {
  id: string;
  status: "Borrowed" | "Returned" | "Not returned";
  userId: string;
  bookId: string;
  title: string;
  author: string;
  releaseDate: string;
  borrowed_on: string;
  borrowed_at: string;
  returned_on: string | null;
  returned_at: string | null;
  deadline: string;
  deadlineExceeded: boolean;
  notice: boolean;
}
export type BorrowedBookRequest = BorrowedBook;

export interface BorrowedBooksJSON {
  borrowedBooks: BorrowedBook[];
}

export interface BooksJSON {
  books: Book[];
}
//new User
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  bookId: string[];
}

export interface UserRequest {
  username: string;
  email: string;
  password: string;
}

export interface UsersJSON {
  users: User[];
}

//Log
export interface Log {
  id: string;
  action:
    | "Registration"
    | "Account deletion"
    | "Login"
    | "Logout"
    | "Borrowing a book"
    | "Returning the borrowed book"
    | "Delete Book"
    | "Update Book"
    | "Adding a book";

  bookId: string | null;
  created_on: string;
  created_at: string;
  userID: string;
}

export type LogRequest = Omit<Log, "id">;

export interface LogsJSON {
  logs: Log[];
}

//Login
export interface LoginRequest {
  login: string;
  password: string;
}
