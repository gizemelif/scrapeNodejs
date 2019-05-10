const rp = require('request-promise');
const $ = require('cheerio');
const potusParse = require('./potusParse');
const fs = require('fs');

let outlet_page_url = 'https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html';



const getOutletInfo = async (outletUrl) => {
    //console.log("getOutletInfo", outletUrl);
    
    return await potusParse(outletUrl);
}

const getOutletLinks = async (url) => {

    const html = await rp(url);

    let outletUrls =[];

    $('.property_title',html).each((i, el) => {
        outletUrls.push(el.attribs.href);
    });

    outletUrls = outletUrls.filter(url => url !== undefined);

    return outletUrls;
};

let currentPage = 1;

const getLastPageNumber = async () => {
    console.log("url is", outlet_page_url)
    const html = await rp(outlet_page_url);

    const hrefs = $('.pageNumbers > a',html);
    console.log("len of hrefs", hrefs.length)
    return hrefs[hrefs.length - 1].attribs["data-page-number"];
};

const getOutletPageLink = async (url) => {
    const html = await rp(url);
    let href;
    const hrefs = $('.pageNumbers > a',html).each((i, el) => {
        const pageNumber = Number(el.attribs["data-page-number"]);
        if (pageNumber - 1 === currentPage) {
            href = el.attribs.href;
            currentPage++;
        }
    });
    console.log("getoutletpagelink", href);
    return href;
};


(async () => {
   
    const lastPageNumber = await getLastPageNumber();
    const arr = [];

    for (let i = 1; i < lastPageNumber; i++) {
        const pageLink = await getOutletPageLink(outlet_page_url);
        outlet_page_url = "https://www.tripadvisor.com.tr/" + pageLink;
        console.log("page url", outlet_page_url)

        const outletLinks = await getOutletLinks(outlet_page_url);
    
        const promises = outletLinks.filter(link => link !== undefined).map(async (outletLink) => {
            arr.push(await getOutletInfo("https://www.tripadvisor.com.tr/" + outletLink))
        })

        await Promise.all(promises);
    }

    console.log("arr:", arr);
    var file = fs.createWriteStream('tripadvisor.txt');
    file.on('error',function(err){
        if(err) console.log(err);
        console.log("Successful");
    });
    file.write("[");
    arr.forEach(function(v){

        file.write(JSON.stringify(v) + ',\n');
    });
    file.write("]");
    file.end();


    
})();


