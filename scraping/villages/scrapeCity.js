const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
// page which i want to scrape

const baseUrl = "https://ar.wikipedia.org";

function fakeApiCall(url) {
  return axios
    .get(url)
    .then((html) => {
      let data = [];
      let $ = cheerio.load(html.data);
      $(".mw-category-group").each((idx, elem) => {
        const lisub = $(elem).find("li");
        $(lisub).each((id, subelem) => {
          const cityName = $(subelem).find("a").text();
          const href = $(subelem).find("a").attr("href");
          data.push({
            cityName,
            href: baseUrl + href,
          });
        });
      });
      return data;
    })
    .catch((err) => console.log(err));
}

const multipleRequests = async (arr) => {
  let promises = [];
  let result = [];
  arr.forEach((ele) => {
    promises.push(fakeApiCall(ele.href));
  });
  const data = await Promise.all(promises);
  data.forEach((data) => {
    result = [...result, ...data];
  });
  return result;
};

const handleData = (data, res) => {
  console.log(data.length);
  const cities = path.join(
    __dirname,
    "..",
    "..",
    "output",
    "villages",
    "fullData",
    "cities.json"
  );

  fs.writeFile(cities, JSON.stringify(data), (err) => {
    if (err) {
      res.status(500).json({ msg: "server error" });
    } else {
      res.json({ msg: "all is good" });
    }
  });
};

module.exports = async (req, res, next) => {
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "output",
    "villages",
    "fullData",
    "main.json"
  );

  fs.readFile(filePath, "utf8", (error, file) => {
    if (error) {
      res.status(500).json({ msg: "server error" });
    } else {
      const mainState = JSON.parse(file);
      multipleRequests(mainState.data).then((result) =>
        handleData(result, res)
      );
    }
  });
};
