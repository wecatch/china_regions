const request = require('request');
const iconv = require('iconv-lite');
const jsdom = require("jsdom");
const path = require("path");

const log4js = require('log4js');
const log = log4js.getLogger();
log.level = 'debug';


const host = "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/";
// const host = "http://localhost:8000";


function absolutePath(url) {
    let basename = path.basename(url);
    url = url.replace(basename, "");
    return url;
}

function joinUrl(url1, url2) {
    if (url2.startsWith('/')) {
        url2 = url2.slice(1, url2.length)
    }
    if (url1.endsWith('/')) {
        return url1 + url2;
    } else {
        return url1 + '/' + url2;
    }
}


function renderDom(html) {
    const {
        JSDOM
    } = jsdom;
    const dom = new JSDOM(html);
    const $ = (require('jquery'))(dom.window);
    return $;
}


function requestProvince() {
    request({
        url: host,
        encoding: null
    }, function(error, response, body) {
        log.debug('error:', error); // Print the error if one occurred
        if (response.statusCode == 200) {
            requestCity(parseProvice(iconv.decode(body, 'gb2312')));
        } else {
            //some error handling
            log.debug("error while fetching url");
        }
    });
}


function requestCity(proviceObject) {
    for (variable in proviceObject) {
        if (proviceObject.hasOwnProperty(variable)) {
            let url = proviceObject[variable];
            request({
                url: url,
                encoding: null
            }, function(error, response, body) {
                requestCountry(parseCity(iconv.decode(body, 'gb2312'), host));
            });
        }
    }
}

function requestCountry(cityObject) {
    for (variable in cityObject) {
        if (cityObject.hasOwnProperty(variable)) {
            let city = cityObject[variable];
            if (city.url) {
                request({
                    url: city.url,
                    encoding: null
                }, function(error, response, body) {
                    requestTown(parseCountry(iconv.decode(body, 'gb2312'), absolutePath(city.url)));
                });
            }
        }
    }
}


function requestTown(countryObject) {
    for (variable in countryObject) {
        if (countryObject.hasOwnProperty(variable)) {
            let country = countryObject[variable];
            log.debug('requestTown ==> ', country);
            if (country.url) {
                request({
                    url: country.url,
                    encoding: null
                }, function(error, response, body) {
                    requestVillage(parseTown(iconv.decode(body, 'gb2312'), absolutePath(country.url)));
                });
            }
        }
    }
}


function requestVillage(townObject) {
    for (variable in townObject) {
        if (townObject.hasOwnProperty(variable)) {
            let town = townObject[variable];
            log.debug('requestVillage ==> ',town);
            if (town.url) {
                request({
                    url: town.url,
                    encoding: null
                }, function(error, response, body) {
                    parseVillage(iconv.decode(body, 'gb2312'));
                });
            }
        }
    }
}


function parseProvice(html) {
    let $ = renderDom(html)
    //let's start extracting the data
    let provinceItems = $(".provincetr a");
    let proviceObject = {}
    provinceItems.each(function(index, element) {
        proviceObject[$(this).text()] = joinUrl(host, $(this).attr("href"));
    });

    return proviceObject;
}

// citytr
function parseCity(html, parentUrl) {
    let $ = renderDom(html);
    let cityObject = {};
    let cityItems = $("tr.citytr")
    cityItems.each(function(index, element) {
        let td0 = null,
            td1 = null,
            url = "";
        if ($(this).find("a").length == 0) {
            td0 = $(this).find("td").first();
            td1 = $(this).find("td").last();
        } else {
            td0 = $(this).find("a").first();
            td1 = $(this).find("a").last();
        }
        let id = td0.text();
        let name = td1.text();
        if (td0.attr("href")) {
            url = joinUrl(parentUrl, td0.attr("href"));
        }
        cityObject[id] = {
            id: id,
            name: name,
            url: url
        }
    });


    return cityObject;

}

// countytr
function parseCountry(html, parentUrl) {
    let $ = renderDom(html);
    let countryObject = {};
    let countryItems = $("tr.countytr")
    countryItems.each(function(index, element) {
        let td0 = null,
            td1 = null,
            url = "";
        if ($(this).find("a").length == 0) {
            td0 = $(this).find("td").first();
            td1 = $(this).find("td").last();
        } else {
            td0 = $(this).find("a").first();
            td1 = $(this).find("a").last();
        }
        let id = td0.text();
        let name = td1.text();
        if (td0.attr("href")) {
            url = joinUrl(parentUrl, td0.attr("href"));
        }
        countryObject[id] = {
            id: id,
            name: name,
            url: url
        }
    });


    return countryObject;

}


//  towntr 
function parseTown(html, parentUrl) {
    let $ = renderDom(html);
    let townObject = {};
    let townItems = $("tr.towntr")
    townItems.each(function(index, element) {
        let td0 = null,
            td1 = null,
            url = "";
        if ($(this).find("a").length == 0) {
            td0 = $(this).find("td").first();
            td1 = $(this).find("td").last();
        } else {
            td0 = $(this).find("a").first();
            td1 = $(this).find("a").last();
        }
        let id = td0.text();
        let name = td1.text();
        if (td0.attr("href")) {
            url = joinUrl(parentUrl, td0.attr("href"));
        }
        townObject[id] = {
            id: id,
            name: name,
            url: url
        }
    });


    return townObject;
}

// villagetr
function parseVillage(html) {
    let $ = renderDom(html);
    let villageObject = {};
    let villageItems = $("tr.villagetr")
    villageItems.each(function(index, element) {
        let td0 = $(this).find("td").first();
        let td1 = $(this).find("td").last();
        let id = td0.text();
        let name = td1.text();
        villageObject[id] = {
            id: id,
            name: name,
        }
    });


    return villageObject;
}


requestProvince()