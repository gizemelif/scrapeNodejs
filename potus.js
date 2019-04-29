const rp = require('request-promise');
const $ = require('cheerio');
const potusParse = require('./potusParse');
const url = 'https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html';

rp(url)
  .then(function(html) {
    //success!
    const wikiUrls = [];
    for (let i = 0; i < 45; i++) {
      wikiUrls.push($('div > a', html)[i].attribs.href);
    }
    return Promise.all(
      wikiUrls.map(function(url) {
        return potusParse('https://www.tripadvisor.com.tr/' + url);
      })
    );
  })
  .then(function(restaurants) {
    console.log(restaurants);
  })
  .catch(function(err) {
    //handle error
    console.log(err);
  });