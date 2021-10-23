const scrapeMainVillage = require('./villages/scrape');
const scrapeVillage = require('./villages/scrapeCity')
const scrapeSubVillage = require('./villages/scrapeSubCity')

const scrapeMain = require('./cities/scrape');
const scrapeCity = require('./cities/scrapeCity')
const scrapeSubCity = require('./cities/scrapeSubCity')

module.exports = {
  scrapeMainVillage,
  scrapeVillage,
  scrapeSubVillage,
  scrapeMain,
  scrapeCity,
  scrapeSubCity
}