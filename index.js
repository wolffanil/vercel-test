const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const db = require("./database");

const { Connection } = require("mongoose");

const app = express();

const Admin = require("./models/admins");

const Comment = require("./models/comments");

dotenv.config();

app.use(helmet());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
      fontSrc: ["'self'", "data:"], // Разрешение загрузки шрифтов из собственных источников и data URI
      scriptSrc: ["'self'"], // Пример разрешения скриптов из собственного источника
      styleSrc: ["'self'"], // Пример разрешения стилей из собственного источника
      // Добавьте другие директивы по мере необходимости
    },
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.post("/red_admin", async (req, res) => {
  const { login, password } = req.body;

  const admin = await Admin.findOne({ login: login, password: password });
  if (admin) {
    // res.cookie.admins = admin;
    await new Promise((res) => setTimeout(res, 1000));
    await res.cookie("admins", admin.login, {
      sameSite: "none",
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    });

    return res.redirect("/");
  } else {
    return res.send("Данный пользователь не найден");
  }
});

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

app.post("/comment_create", async (req, res) => {
  const { name, resp, diz, description } = req.body;
  const currentDate = new Date().toISOString().slice(0, 10);

  const comments = await Comment.create({
    name,
    resp,
    diz,
    description,
    date: currentDate,
  });
  if (comments) {
    await new Promise((res) => setTimeout(res, 1000));

    return res.redirect("/comment");
  }
});

app.get("/", async (req, res) => {
  await new Promise((res) => setTimeout(res, 1000));
  const { currentAdmin } = req.cookies;

  res.render("index", { admin: currentAdmin });
});

app.get("/fklhgldeujgls", async (req, res) => {
  await new Promise((res) => setTimeout(res, 1000));

  res.render("admin");
});
app.get("/comment", async (req, res) => {
  const comments = await Comment.find();
  const currentAdmin = req.cookies.admins;
  await new Promise((res) => setTimeout(res, 1000));

  res.render("comment", { comments: comments, admin: currentAdmin });
});

app.post("/comment/delete/:id", async (req, res) => {
  const commentId = req.params.id;

  try {
    await Comment.findByIdAndDelete(commentId); // Удаляем комментарий по ID
    await new Promise((res) => setTimeout(res, 1000));

    return res.redirect("/comment"); // Перенаправляем на страницу комментариев после удаления
  } catch (error) {
    console.error(error);
    return res.status(500).send("Ошибка при удалении комментария");
  }
});

const PORT = process.env.PORT || 5555; // используем порт из переменной окружения или 5555 по умолчанию
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
