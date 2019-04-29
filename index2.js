const rp = require('request-promise');
const $ = require('cheerio');
const potusParse = require('./potusParse');

const url = 'https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html';

const getOutletInfo = async (outletUrl) => {
    console.log("getOutletInfo", outletUrl);
    return await potusParse(url);
}

const getOutletLinks = async (url) => {

    const html = await rp("https://www.tripadvisor.com.tr" + url);

    let outletUrls =[];

    $('.property_title',html).each((i, el) => {
        outletUrls.push(el.attribs.href);
    });

    outletUrls = outletUrls.filter(url => url !== undefined);

    return outletUrls;
};

let currentPage = 1;

const getLastPageNumber = async () => {
    const html = await rp("https://www.tripadvisor.com.tr" + url);

    const hrefs = $('.pageNumbers > a',html);
    return hrefs[hrefs.length].attribs["data-page-number"];
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
    return href;
};


(async () => {
   
    const lastPageNumber = await getLastPageNumber();

    for (let i = 1; i < lastPageNumber; i++) {
        const pageLink = await getOutletPageLink(url);

        const outletLinks = await getOutletLinks(pageLink);
    
    
        const promises = outletLinks.forEach(async (outletLink) => {
            console.log(await getOutletInfo(outletLink));
        })
    
    }


    Promise.all([promises]);
    
})();