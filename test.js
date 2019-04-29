const rp = require('request-promise');
const $ = require('cheerio');
const count =30;
const url2 = 'https://www.tripadvisor.com.tr/Restaurants-g293974-oa'+toString(count+30)+'-Istanbul.html';
const parse = function(url2) {
    return new Promise((resolve, reject) => {
        return rp(url2)
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

module.exports = parse;