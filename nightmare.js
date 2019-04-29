const Nightmare = require('nightmare');
const cheerio = require('cheerio');

const nightmare = Nightmare({ show: true })
const url = 'https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html';

// Request making using nightmare
nightmare
 .goto(url)
 .wait('body')
 .click('button.search_button')
 .type('input.TYPEAHEAD_GEO_ID', 'istanbul')
 .click('button.search_button')
 .wait('div.ui_columns')
 .evaluate(() => document.querySelector('body').innerHTML)
 .end()
 .then(response => {
   console.log(getData(response));
 }).catch(err => {
   console.log(err);
 });

// Parsing data using cheerio
let getData = html => {
 data = [];
 const $ = cheerio.load(html);
 $('div.EATERY_SEARCH_RESULTS:nth-child(2) div.bhgxx2.col-12-12').each((row, raw_element) => {
   $(raw_element).find('div div div div').each((i, elem) => {
     let title = $(elem).find('div div div a:nth-child(2)').text();
     let link = $(elem).find('div div a:nth-child(2)').attr('href');
     if (title) {
       data.push({
         title : title,
         link : link
       });
       
     }
   });
 });
 return data;
}