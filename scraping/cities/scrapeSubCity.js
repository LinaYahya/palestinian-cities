const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
// page which i want to scrape

const baseUrl = "https://ar.wikipedia.org";

function fakeApiCall(url, cityName) {
  return axios
    .get(url)
    .then((html) => {

      let area = "";
      let population = ""
      let $ = cheerio.load(html.data);
      const areaEle = $(".infobox").find("tr")

      const descEle = $(".mw-parser-output").find("p")[0];
      const geoEle = $(".mw-parser-output").find("p")[1];

      const dscText = $(descEle).text();
      const geoText = $(geoEle).text()
      $(areaEle).each((idx, elem) => {
        const key = $(elem).find("th").text()
        const val = $(elem).find("td").text()
        if (key === "عدد السكان") {
          population = val
        };
        if (key === "المساحة") {
          area = val
        }
      })
      console.log({ dscText, geoText })
      return ({ href: url, dscText, geoText, area, population, cityName })
    })
    .catch((err) =>{
      console.log(err, url)
      return "failed"
    });
}

const multipleRequests = async (arr) => {
  let promises = [];
  let result = [];
  arr.forEach((ele) => {
    promises.push(fakeApiCall(ele.href, ele.cityName));
  });
  const data = await Promise.all(promises);
  data.forEach((data) => {
    result = [...result, data];
  });
  return result;
};

const handleData = (data, res) => {
  console.log(data.length)
  const cities = path.join(__dirname, "subCities.json");

  fs.writeFile(cities, JSON.stringify(data), (err) => {
    if (err) {
      res.status(500).json({ msg: "server error" });
    } else {
      res.json({ msg: "all is good" });
    }
  });
};
module.exports = async (req, res, next) => {
  const filePath = path.join(__dirname, "cities.json");

  fs.readFile(filePath, "utf8", (error, file) => {
    if (error) {
      res.status(500).json({ msg: "server error" });
    } else {
      const mainState = JSON.parse(file);
      multipleRequests(mainState).then((result) =>
        handleData(result, res)
        // res.json(result)
      );
          // const cities = path.join(__dirname, "subCities.json");
          // fs.writeFile(cities, JSON.stringify(data), (err) => {
          //   if (err) {
          //     res.status(500).json({ msg: "server error" });
          //   } else {
          //     res.json({ msg: "all is good" });
          //   }
          // });
      
    }
  });
};
