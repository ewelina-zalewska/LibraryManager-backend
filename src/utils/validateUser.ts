import { User, UsersJSON } from "#types/index.ts";

type ValidateUser = {
  jsonData: UsersJSON;
  login: string;
  enteredPassword: string;
};

export const validateUser = ({
  jsonData,
  login,
  enteredPassword,
}: ValidateUser) => {
  const users = jsonData.users;

  const COMPARE_LOGIN = (users: User[], login: string) =>
    Object.values(users).some((user) => user.id === login);

  const COMPARE_PASSWORD = (users: User[], password: string) =>
    Object.values(users).some((user) => user.password === password);

  const loginExists = COMPARE_LOGIN(users, login);
  const passwordExists = COMPARE_PASSWORD(users, enteredPassword);

  return { loginExists, passwordExists };
};
