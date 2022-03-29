const express = require("express");
const router = express.Router();
const session = require("express-session");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const { reset } = require("nodemon");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    name: "cookietest",
    secret: "SecretCodejazkjhalkjzhkajzh",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: true,
      secure: false,
    },
  })
);
const port = 3000;

app.get("/home", (req, res) => {
  fs.readFile(__dirname + "/book.txt", (err, data) => {
    let booksData = JSON.parse(data.toString());
    let userData = JSON.parse(data.toString());
    res.render("pages/home", { book: booksData, name: userData });
  });
});

app.get("/", (req, res) => {
  res.render("pages/log");
});

app.get("/addBook", (req, res) => {
  res.render("pages/addBook");
});

app.get("/register", (req, res) => {
  res.render("pages/register");
});

app.post("/addBook", function (req, res) {
  console.log(req.body);
  res.redirect("/home");
  fs.readFile(__dirname + "/book.txt", (err, data) => {
    const d = JSON.parse(data.toString());
    d.push(req.body);
    fs.writeFile(__dirname + "/book.txt", JSON.stringify(d), () => {
      console.log("success");
    });
  });
});

app.post("/register", function (req, res) {
  console.log(req.body);

  fs.readFile(__dirname + "/user.txt", (err, data) => {
    const userData = JSON.parse(data.toString());
    userData.push(req.body);
    fs.writeFile(__dirname + "/user.txt", JSON.stringify(userData), () => {
      console.log("success");
      res.redirect("/");
    });
  });
});

app.post("/login", (req, res) => {
  fs.readFile(__dirname + "/user.txt", (err, data) => {
    if (err) throw err;
    const content = JSON.parse(data.toString());
    const user = content.find(
      (user) =>
        user.email === req.body["email"] &&
        user.password === req.body["password"]
    );
    console.log(user);
    if (!user) {
      res.redirect("/");
      console.log("email or password is worng");
      return;
    } else {
      req.session.username = user.username;

      console.log("username : " + req.session.username);
      res.redirect("/home");
      return;
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
