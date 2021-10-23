const fs = require("fs");
const path = require("path");
const getRandom = require("../assets");

const cutVillages = () => {
  const pathReadFile = path.join(
    __dirname,
    "..",
    "..",
    "output",
    "villages",
    "fullData",
    "subCities.json"
  );

  const pathWriteFile = path.join(
    __dirname,
    "..",
    "..",
    "output",
    "villages",
    "croppedVillages.json"
  );
  fs.readFile(pathReadFile, "utf8", (error, file) => {
    if (error) {
      console.log("read file failed", err);
    } else {
      const villages = JSON.parse(file);
      const data = getRandom(villages, 100);
      fs.writeFile(pathWriteFile, JSON.stringify(data), (err) => {
        if (err) {
          console.log("write file failed");
        } else {
          console.log({ msg: "all is good" }, data.length);
        }
      });
    }
  });
};

cutVillages();
