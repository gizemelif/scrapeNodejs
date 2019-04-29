async function getCurrency(url){
    
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
getCurrency("https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html")
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
});