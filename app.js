import express from "express";
import bodyParser from "body-parser";

import cors from "cors";
import booksRoutes from "./routes/books.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/books", booksRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Server");
});

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
