var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

//connect MongoDATABASE
const connectDB = require("./configfiles/connectdatabase");
connectDB();

//initialize DATABASE
const initDb = require("./initDatabase");
initDb();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var PlansRouter = require("./routes/programplans");
var AuthRouter = require("./routes/auth");
var SearchRouter = require("./routes/search");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());

//add bootstrap ad jquery
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist")));
app.use(express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use(
  express.static(path.join(__dirname, "node_modules/bootstrap-icons/font"))
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/plans", PlansRouter);
app.use("/auth", AuthRouter);
app.use("/search", SearchRouter);

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
