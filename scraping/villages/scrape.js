const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
// page which i want to scrape

const url =
  "https://ar.wikipedia.org/wiki/%D8%AA%D8%B5%D9%86%D9%8A%D9%81:%D9%82%D8%B1%D9%89_%D9%81%D9%84%D8%B3%D8%B7%D9%8A%D9%86";
const baseUrl = "https://ar.wikipedia.org";

module.exports = async (req, res, next) => {
  await axios
    .get(url)
    .then((html) => {
      let data = [];
      let $ = cheerio.load(html.data);

      $(".CategoryTreeItem").each((idx, elem) => {
        const cityName = $(elem).find("a").text();
        const href = $(elem).find("a").attr("href");

        data.push({
          cityName,
          href: baseUrl + href,
        });
      });
      const mainStates = path.join(
        __dirname,
        "..",
        "..",
        "output",
        "villages",
        "fullData",
        "main.json"
      );
      fs.writeFile(mainStates, JSON.stringify({ data }), (err) => {
        if (err) {
          res.status(500).json({ msg: "server error" });
        } else {
          res.json({ msg: "all is good" });
        }
      });
    })
    .catch((err) => console.log(err));
};
