var request = require('request');
var cheerio = require('cheerio');

var url = "https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html";

request(url,function(error,response,body){
    if(!error){
        var $ = cheerio.load(body);
        var pages = $('.pageNumbers .pageNum.current .ta.trackEventOnPage .pageNum taLnk').text();

        console.log('page numbers: '+pages);
    }else{
        console.log("we've encountered an error: "+error);
    }
});