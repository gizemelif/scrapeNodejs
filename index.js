const rp = require('request-promise');
const $ = require('cheerio');
const potusParse = require('./potusParse');

const url = 'https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html';

const outputFile = 'data.json';
const parsedResults = [];
const pageLimit =50;

let pageCounter = 0;
let resultCount = 0;

rp(url)
    .then(function(html){
        let tripUrls =[];
        
        $('.property_title',html).each((i, el) => {
            tripUrls.push(el.attribs.href);
        });
        tripUrls = tripUrls.filter(url => url !== undefined);
        console.log("len of trip urls", tripUrls.length);
        return Promise.all(
            tripUrls.map(function(url){
                console.log("potusing", url);
                return potusParse('https://www.tripadvisor.com.tr'+url);
            })
        );
        
    })
    .then(function(restaurants){
        console.log("potused successfully");
        console.log(restaurants);
    })
    .catch(function(err){
        //handle error
        console.log(err);
    });

const getNumber = async(url)=>{
    try{
        const response = await rp('https://www.tripadvisor.com.tr'+url);
        const $ = cheerio.load(response.data);
        const nextPageLink = $('.pageNumbers').find('.current').parent().find('a').attr('href');
        console.log({nextPageLink});
        pageCounter++;

        if (pageCounter === pageLimit) {
            exportResults(parsedResults);
            return false;
          }
          getNumber(nextPageLink);
    }catch(error){
        exportResults(parsedResults);
        console.error(error);
    }

    Promise.all([nextPageLink]);
}
const exportResults = (parsedResults) => {
    fs.writeFile(outputFile, JSON.stringify(parsedResults, null,4), (err) => {
      if (err) {
        console.log(err);
      }
      console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} Results exported successfully to ${chalk.underline.bold(outputFile)}\n`));
    })
  }
/*
// Requesting to the website
request('https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html', (error, response, html) => {
   // Checking that there is no errors and the response code is correct
   if(!error && response.statusCode === 200){
       // Declaring cheerio for future usage
       const $ = cheerio.load(html);

       // Looking at the inspector or source code we will select the following id value
       const siteHeading = $('#EATERY_OVERVIEW_BOX') ;
       const output1 = siteHeading.find('a').each((i, el) => {
            console.log(el.attribs["href"]);

       })

       // Showing our result on the console
       // console.log(output1);
       $('.result-card span').each((i,el)=>{
           const item = $(el).html;
           const link = $(el).attr('href');

          // console.log(item);
       })
   }
})*/
//------------------------------------
