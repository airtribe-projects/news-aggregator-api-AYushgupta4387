const express = require("express");
const userRouter = require("./routes/user");
const newsRouter = require("./routes/news");

const app = express();
require("dotenv").config();

const port = process.env.PORT_NUMBER;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING, {})
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        return console.log("Something bad happened", err);
      }

      console.log(`Server is listening on ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/v1/users", userRouter);
app.use("/api/v1/news", newsRouter);

module.exports = app;
