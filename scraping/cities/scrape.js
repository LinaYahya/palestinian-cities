const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
// page which i want to scrape
const wiki =
  "https://mawdoo3.com/%D9%85%D8%AF%D9%86_%D9%88%D9%82%D8%B1%D9%89_%D9%81%D9%84%D8%B3%D8%B7%D9%8A%D9%86";

const url =
  "https://ar.wikipedia.org/wiki/%D9%85%D8%AF%D9%86_%D9%81%D9%84%D8%B3%D8%B7%D9%8A%D9%86";
const baseUrl = "https://ar.wikipedia.org";

module.exports = async (req, res, next) => {
  await axios
    .get(url)
    .then((html) => {
      let data = [];
      let $ = cheerio.load(html.data);

      const ele = $(".wikitable")[3];
      console.log(ele, "ele");
      $(ele)
        .find("tr")
        .each((idx, elem) => {
          let cityName = "";
          let href = "";
          let population = "";
          if (idx !== 0) {
            $(elem)
              .find("td")
              .each((id, city) => {
                if (id === 1) {
                  cityName = $(city).find("a").text();
                  href = $(city).find("a").attr("href");
                }
                if (id === 3) {
                  console.log(city, "id 3");
                  population = $(city).text();
                }
              });
            data.push({
              cityName,
              href: baseUrl + href,
              population,
            });
          }
        });
      const mainStates = path.join(
        __dirname,
        "..",
        "..",
        "output",
        "cities",
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
