const $ = require('document');

$(document).ready(function(){
    $.getJson("https://www.tripadvisor.com.tr/Restaurants-g293974-Istanbul.html",function(veri){
        var name = veri.name;
        var coord = veri.coords;
        
        console.log(name);
        console.log(coord);
    });
    
  })