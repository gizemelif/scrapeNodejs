
const rp = require('request-promise');
const $ = require('cheerio');
//const potusParse = require('./potusParse')
const url = 'https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html';

const potusParse = function(url) {
    return new Promise((resolve, reject) => {
        return rp(url)
        .then(function(html) {
          return resolve({
            name: $('.restaurantName .h1', html).text(),
            address: $('.detail .street-address', html).text(),
            locationId: $('.is-hidden-mobile blEntry address ui_link',html).text()
          });
        })
        .catch(reject);
    })
};

module.exports = potusParse;

/*
rp(url)
  .then(function(html) {
      const tripUrls =[];

      for(let i=0; i<400; i++){
          tripUrls.push($())
      }
    console.log($('.ui_header h1', html).text());
    console.log($('.detail .street-address', html).text());
  })
  .catch(function(err) {
    //handle error
  });
*/