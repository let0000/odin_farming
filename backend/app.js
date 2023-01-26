const { request } = require("express");
const express = require("express");
const app = express();
const session = require("express-session");

app.use(
  session({
    secret: "secret code",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60, // 쿠기 유효시간 : 1 시간
    },
  })
);

const server = app.listen(3000, () => {
  console.log("Server started.");
});

const db = {
  database: "odin-dairy",
  connectionLimit: 10,
  host: "svc.gksl2.cloudtype.app",
  user: "root",
  password: "root",
  port: "30071",
};

const dbPool = require("mysql").createPool(db);

app.post("/api/login", async (request, res) => {
  request.session["email"] = "wlsgh8309@naver.com";
  res.send("OK");
});

app.post("/api/logout", async (request, res) => {
  request.session.destroy();
  res.send("OK");
});

const sql = require("./sql.js");

app.post("/api/:alias", async (request, res) => {
  if (!request.session.email) {
    return res.status(401).send({
      error: "로그인을 해야합니다.",
    });
  }

  try {
    res.send(await req.db(request.params.alias));
  } catch (error) {
    res.status(500).send({
      error: err,
    });
  }
});

const req = {
  async db(alias, param = [], where = "") {
    return new Promise((resolve, reject) =>
      dbPool.query(sql[alias].query + where, param, (error, rows) => {
        if (error) {
          if (error.code != "ER_DUP_ENTRY") console.log(error);
          resolve({
            error,
          });
        } else resolve(rows);
      })
    );
  },
};