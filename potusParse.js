
const rp = require('request-promise');
const $ = require('cheerio');

const potusParse = function(url) {
    return new Promise((resolve, reject) => {
        return rp(url)
        .then(function(html) {
          const name =  $('.restaurantName .h1', html).text();
          const address = $('.detail .street-address', html).text();
          const maps = $('div.poiEntryWrapper .shownOnMap',html).data();
          const maps_dict = [maps['lat'],maps['lng']];
          
          return resolve({
            name,
            address,
            maps_dict
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