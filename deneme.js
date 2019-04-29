const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const chalk = require('chalk');
const $ = cheerio.load(response.data);
const response = require('axios');
const url = 'https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html';
const outputFile = 'data.json';
const parsedResults =[];
const pageLimit = 10;
let pageCounter = 0;
let resultCount = 0;


console.log(chalk.yellow.bgBlue('\n Scraping of ${chalk.underline.bold(url)} initiated...\n'));
 const getWebsiteContent = async(url)=>{
     try{
         response = await axios.get(url);
         
     }catch(error){
         console.error(error);
     }
 }
 getWebsiteContent(url);
 //new lists
 $('.restaurantName .h1').map((i,el)=>{
     const count = resultCount++;
     const title = $(el).find('a').attr('href');
     const url = $(el).find('h1').text();
     const metadata ={
         count: count,
         title: title,
         url: url
     }
     parsedResults.push(metadata);
 })
 const exportReports =(parsedResults)=>{
     fs.writeFile(outputFile,JSON.stringify(parsedResults,null,4),(err)=>{
         if(err){
             console.log(err);
         }
         console.log(chalk.yellow.bgBlue('\n ${chalk.underline.bold(parsedResults.lenght)}Results exported successfully to ${chalk.underline.bold(outputFile)}/n'));
         
     })
 }
 //Pagination Elements Link
 const nextPageLink = $('.unified.pagination.js_pageLinks').find('.pageNum.current').parent().next().find('a').attr('href');
 console.log(chalk.cyan('Scraping: ${nextPageLink}'));
 pageCounter++;
try{
    if(pageCounter == pageLimit){
        exportReports(parsedResults);
        return false;
    }
    getWebsiteContent(nextPageLink);

}catch(error){
     exportReports(parsedResults);
     console.error(error);
 }