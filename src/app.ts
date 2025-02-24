import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import cors from "cors";
import { getData } from "./config/getData.ts";
import booksRoutes from "#routes/books.ts";
import registerRoutes from "#routes/register.ts";
import logsRoutes from "#routes/logs.ts";
import loginRoutes from "#routes/login.ts";
import logoutRoutes from "#routes/logout.ts";
import authAdminRoutes from "#routes/auth/admin.ts";
import authUserRoutes from "#routes/auth/user.ts";

const { PORT, FRONTEND_PORT } = getData();

const corsOptions = {
  origin: `http://localhost:${FRONTEND_PORT}`,
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
app.use(express.json());

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/books", booksRoutes);
app.use("/register", registerRoutes);
app.use("/logs", logsRoutes);
app.use("/auth/admin", authAdminRoutes);
app.use("/auth/user", authUserRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
