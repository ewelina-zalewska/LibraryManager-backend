export interface Book {
  id: string;
  title: string;
  author: string;
  copies: number;
  description: string;
  releaseYear: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  bookId: string[];
}

export interface UserRequest {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface UsersJSON {
  users: User[];
}
