const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const passport = require("passport");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const indexRouter = require("./routes/index");
const session = require("express-session");
const initializePassport = require("./passport_config");

dotenv.config();

const main = async () => {
  try {
    await mongoose.connect(process.env.URL);
  } catch (err) {
    console.log(err);
  }
};
main();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.URL,
      collectionName: "blog_api_sessions"
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
