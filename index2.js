const rp = require('request-promise');
const $ = require('cheerio');
const potusParse = require('./potusParse');
const fs = require('fs');

let outlet_page_url = 'https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html';



const getOutletInfo = async (outletUrl) => {
    //console.log("getOutletInfo", outletUrl);
    try {
        return await potusParse(outletUrl);
    } catch (e) {
        console.error(e, outletUrl);
        return {};
    }
    
    
}

const getOutletLinks = async (url) => {

    try{
        const html = await rp(url);

        let outletUrls =[];

        $('.property_title',html).each((i, el) => {
            outletUrls.push(el.attribs.href);
        });

        outletUrls = outletUrls.filter(url => url !== undefined);

        return outletUrls;
    }catch(e){
        return{};
    }
    
};

let currentPage = 1;

const getLastPageNumber = async () => {
    const html = await rp(outlet_page_url);
    const hrefs = $('.pageNumbers > a',html);
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
            return false;
        }
    });
    return href;
};


(async () => {
   
    const lastPageNumber = await getLastPageNumber();

    var file = fs.createWriteStream('phoneNumber.txt', {flags:'a', encoding: 'utf-8'});

    for (let i = 1; i < 2; i++) {
        console.log("current page", i);
        const pageLink = await getOutletPageLink(outlet_page_url);
        outlet_page_url = "https://www.tripadvisor.com.tr/" + pageLink;

        const outletLinks = await getOutletLinks(outlet_page_url);
    
        const promises = outletLinks.filter(link => link !== undefined).map(async (outletLink) => {
            const outlet = await getOutletInfo("https://www.tripadvisor.com.tr/" + outletLink);
            file.write(JSON.stringify(outlet) + ",");
        })
        await Promise.all(promises);
    }

    file.on('error',function(err){
        if(err) console.log(err);
        console.log("Successful");
    });

    file.end();


    
})();


