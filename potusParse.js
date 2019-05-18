
const rp = require('request-promise');
const $ = require('cheerio');

let i = 0;
const potusParse = function(url) {
    return new Promise((resolve, reject) => {
        return rp(url)
        .then(function(html) {
          const outlet = {};
          outlet.id = $('.blRow', html).attr()["data-locid"];
          outlet.name =  $('.restaurantName .h1', html).text();
          outlet.address = $('.detail .street-address', html).text();

          const maps = $('div.poiEntryWrapper .shownOnMap',html).data();
          if (maps) {
            outlet.longitude = maps["lng"];
            outlet.latitude = maps["lat"];
          }

          console.warn("current outlet", i++, outlet.id,outlet.name,outlet.address);
          return resolve(outlet);
        })
        .catch((err) => {
            console.error(err, "get outlet info")
            return resolve({id: "undefined"})
        });
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