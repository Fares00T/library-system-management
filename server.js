const express = require("express");
const router = express.Router();
const session = require("express-session");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const { reset } = require("nodemon");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
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
    res.sendFile(__dirname + "/home.html");
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/log.html");
});

app.get("/addBook", (req, res) => {
  res.sendFile(__dirname + "/addBook.html");
});

app.post("/addBooktext", function (req, res) {
  console.log(req.body);
  fs.readFile(__dirname + "/book.txt", (err, data) => {
    const bookdata = JSON.parse(data.toString());
    bookdata.push(req.body);
    fs.writeFile(__dirname + "/book.txt", JSON.stringify(bookdata), () => {
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
      res.send("user added");
    });
  });
});

app.get("/bookslist", (req, res) => {
  fs.readFile(__dirname + "/book.txt", (err, data) => {
    const booksdata = JSON.parse(data.toString());
    res.status(200).json(booksdata);
  });
});

app.get("/theName", (req, res) => {
  fs.readFile(__dirname + "/user.txt", (err, data) => {
    const theName = JSON.parse(data.toString());
    res.status(200).json(theName);
  });
});

app.post("/login", (req, res) => {
  console.log(req.body);
  fs.readFile(__dirname + "/user.txt", (err, data) => {
    if (err) throw err;
    const content = JSON.parse(data.toString());
    const user = content.find(
      (user) =>
        user.email === req.body["loginEmail"] &&
        user.password === req.body["loginPassword"]
    );
    console.log(user);
    if (!user) {
      res.status(422).send("email or password is worng");
      console.log("email or password is worng");
      return;
    } else {
      req.session.username = user.username;

      console.log("username : " + req.session.username);
      res.send("true");
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
