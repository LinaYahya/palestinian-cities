const express = require("express");
const path = require("path");

const {
  scrapeMainVillage,
  scrapeSubVillage,
  scrapeVillage,
  scrapeMain,
  scrapeCity,
  scrapeSubCity,
} = require("./scraping");

const app = express();

// disable powered by express header
app.disabled("x-powered-by");
// set port number
app.set("port", 8080);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// get villages
app.get("/main/village", scrapeMainVillage);
app.get("/village", scrapeVillage);
app.get("/subVillage", scrapeSubVillage);

// get cities
app.get("/main/city", scrapeMain);
app.get("/city", scrapeCity);
app.get("/subCity", scrapeSubCity);

app.use((req, res) => {
  res.status(404).json({ msg: "sth wrong" });
});

app.use((err, req, res, next) => {
  console.log(err, "server error >>>>>>>>> ");
  res.status(500).json(err);
});

// listen on dynamic port number
app.listen(app.get("port"), () => {
  console.log("App running on port", app.get("port"));
});
