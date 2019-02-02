const fs = require("fs");
const iconv = require('iconv-lite');
const jsdom = require("jsdom");
const path = require("path");
const Promise = require("bluebird");
const log = require('tracer').console();
// const request = Promise.promisifyAll(require("request"), {multiArgs: true});
const request = require("request");


const host = "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/";
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


function newRequestPromise(url){


    return 

    return new Promise(function(resolve, reject){
        request({
            url: url,
            encoding: null
        }, function(error, response, body) {
            if (response.statusCode == 200) {
                resolve(response, body);
            } else {
                //some error handling
                reject(error)
            }
        });
    });
}


function requestProvince() {

    // request provice
    newRequestPromise(host).then(function(response, body){
        return parseProvice(iconv.decode(body, 'gb2312')); 
    }).then(function(proviceResult){
        // request city
        fs.writeFileSync('src/provice.json', JSON.stringify(proviceResult));
        return Promise.all(proviceResult.map(function(item){
            return newRequestPromise(item.url);
        }));
    }).then(function(respResults){
        let urls = [];
        respResults.forEach(function(item, index){
            urls = urls.concat(parseCity(iconv.decode(item[1], 'gb2312'), host));
        })

        fs.writeFileSync('src/city.json', JSON.stringify(urls));
        // request country
        return Promise.all(urls.filter(x=>x.url.length > 0).map(function(item){
            return newRequestPromise(item.url);
        }))
    }).then(function(respResults){
        let urls = [];
        respResults.forEach(function(item, index){
            urls = urls.concat(parseCountry(iconv.decode(item[1], 'gb2312'), absolutePath(item[0].request.href))); 
        });

        fs.writeFileSync('src/country.json', JSON.stringify(urls));
        // request town
        return Promise.all(urls.filter(x=>x.url.length).map(function(item){
            return newRequestPromise(item.url);
        }))
    }).then(function(respResults){
        let urls = [];
        respResults.forEach(function(item, index){
            urls = urls.concat(parseTown(iconv.decode(item[1], 'gb2312'), absolutePath(item[0].request.href))); 
        });

        fs.writeFileSync('src/town.json', JSON.stringify(urls));
        // request town
        return Promise.all(urls.filter(x=>x.url.length).map(function(item){
            return newRequestPromise(item.url);
        }))
    }).then(function(respResults){
        let urls = [];
        respResults.forEach(function(item, index){
            urls = urls.concat(parseVillage(iconv.decode(item[1], 'gb2312'))); 
        });
        fs.writeFileSync('src/village.json', JSON.stringify(urls));
    }).catch(function(error){
        log.debug("error while fetching url ==> ", error);
    });
}


function parseProvice(html) {
    let $ = renderDom(html)
    let result = [];
    $(".provincetr a").each(function(index, element) {
        result.push({
            name: $(element).text(),
            url: joinUrl(host, $(element).attr("href")),
        })
    });

    return result;
}

// citytr
function parseCity(html, parentUrl) {
    let $ = renderDom(html);
    let result = [];
    $("tr.citytr").each(function(index, element) {
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
        result.push({
            id: id,
            name: name,
            url: url
        });
    });

    return result;

}

// countytr
function parseCountry(html, parentUrl) {
    let $ = renderDom(html);
    let result = [];
    $("tr.countytr").each(function(index, element) {
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
        result.push({
            id: id,
            name: name,
            url: url
        });
    });


    return result;

}


//  towntr 
function parseTown(html, parentUrl) {
    let $ = renderDom(html);
    let result = []; 
    $("tr.towntr").each(function(index, element) {
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
        result.push({
            id: id,
            name: name,
            url: url
        });
    });

    log.debug(result);

    return result;
}

// villagetr
function parseVillage(html) {
    let $ = renderDom(html);
    let result = [];
    $("tr.villagetr").each(function(index, element) {
        let td0 = $(this).find("td").first();
        let td1 = $(this).find("td").last();
        let id = td0.text();
        let name = td1.text();
        result.push({
            id: id,
            name: name,
        });
    });

    return result;
}


requestProvince()