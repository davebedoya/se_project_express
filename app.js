const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const { errors } = require("celebrate");

const mainRouter = require("./routes/index");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");

const { PORT = 3001 } = process.env;

const app = express();
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // console.log("connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use("/", mainRouter);

app.use(errorLogger);
// celebrate error handler
app.use(errors());
// our centralized handler
app.use(errorHandler);

app.listen(PORT, () => {
  // console.log(`listening on port ${PORT}`);
});
