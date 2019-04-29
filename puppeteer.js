const puppeteer = require('puppeteer');

let tripadvisorUrl = 'https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html';
(async()=>{
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.setViewport({width:1920, height:926});
    await page.goto(tripadvisorUrl);

    //get restaurants details
    let restaurantData = await page.evaluate(()=>{
        let restaurants = [];
        let restElms = document.querySelectorAll('.property_title');

        restElms.forEach((restElement)=>{
            let restJson={};
            try{
                restJson.name = restElement.querySelector('.restaurantName .h1').textContent();
                restJson.address = restElement.querySelector('.detail .street-address').textContent();

            }catch(exception){

            }
            restaurants.push(restJson);
        });
        return restaurants;
    });
    console.dir(restaurantData);
})();