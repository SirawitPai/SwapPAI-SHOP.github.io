const http = require("http");

//อ่านไฟล์  user.json
const fs = require("fs");

const url = require("url");

//การใช้ Express ย้ายไปใช้ Class Routing ที่ไฟลฺ์ myRouter
const express = require("express");
const router = require("./routes/myRouter");
const app = express();
const path = require("path");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const session = require("express-session");

//การอ้างอิงที่เก็บ Template อยู่ในโฟรเดอร์ viesw
app.set("views", path.join(__dirname, "views"));
//การกำหนดรูปแบบเป็น ejs
app.set("views engine", "ejs");

// Body parse middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(
  session({ secret: "mysession", resave: false, saveUninitialized: false })
);

//การเรียกใช้ router
app.use(router);

//การกำหนดพื้นที่ในการจัดเก็บ static file
app.use(express.static(path.join(__dirname, "public")));

// const indextPage = path.join(__dirname,"templates/index.html");

const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get("host")}${req.orignalUrl}`);
  next();
};

// Init Middleware
app.use(logger);

app.listen(8080, () => {
  console.log("start Server at port 8080.");
});
