import express from "express";
import bodyParser from "body-parser";

import cors from "cors";
import booksRoutes from "#routes/books.ts";
import registerRoutes from "#routes/register.ts";
import logsRoutes from "#routes/logs.ts";

const app = express();
app.use(express.json());
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use("/books", booksRoutes);
app.use("/register", registerRoutes);
app.use("/logs", logsRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Server");
});

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
