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
  releaseYear: string;
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
    | "Returning the borrowed book";
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
