const fs = require("fs");
const iconv = require('iconv-lite');
const jsdom = require("jsdom");
const path = require("path");
const Promise = require("bluebird");
const log = require('tracer').console();
const request = Promise.promisifyAll(require("request"), {multiArgs: true});
const requestSync = require("request");


const host = "http://219.235.129.117:80/tjsj/tjbz/tjyqhdmhcxhfdm/2018/";
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


function newRequestPromise(url) {
    url = url.replace('www.stats.gov.cn', '219.235.129.117:80');
    log.debug('request == >', url);
    return request.getAsync({
        url: url,
        encoding: null,
        timeout: 50000
    });
    // promise resolve only accept value
    // return new Promise(function(resolve, reject) {
    //     request({
    //     }, function(error, response, body) {
    //         log.debug(response.statusCode);
    //         log.debug(response.body);
    //         if (response.statusCode == 200) {
    //             resolve([response, response.body]);
    //         } else {
    //             //some error handling
    //             reject(error)
    //         }
    //     });
    // }, );
}


const provincePath = 'src/province.json';
const cityPath = 'src/city.json';
const countryPath = 'src/country.json';
const townPath = 'src/town.json';
const villagePath = 'src/village.json';

const fileExists = {}
fileExists.provincePath = fs.existsSync(provincePath);
fileExists.cityPath = fs.existsSync(cityPath);
fileExists.countryPath = fs.existsSync(countryPath);
fileExists.townPath = fs.existsSync(townPath);
fileExists.villagePath = fs.existsSync(villagePath);


function requestProvince() {
    // request provice
    if (fileExists.provincePath){
        return new Promise(function(resolve, reject){
            resolve(JSON.parse(fs.readFileSync(provincePath)));
        });
    }else {
        return newRequestPromise(host).spread(function(response, body) {
            return parseProvice(iconv.decode(body, 'gb2312'));
        })
    }
    
}

function main(){
    requestProvince().then(function(proviceResult) {
        // request city
        fs.writeFileSync(provincePath, JSON.stringify(proviceResult));
        if (fileExists.cityPath) {
            return JSON.parse(fs.readFileSync(cityPath))
        } else {
            return Promise.all(proviceResult.map(function(item) {
                return newRequestPromise(item.url);
            }));
        }
    }).then(function(respResults) {
        let urls = [];
        if (!fileExists.cityPath) {
            respResults.forEach(function(item, index) {
                urls = urls.concat(parseCity(iconv.decode(item[1], 'gb2312'), host));
            })
            fs.writeFileSync(cityPath, JSON.stringify(urls));
        } else {
            //已经存在表示已经爬取到了 city 信息
            urls = respResults;
        }

        // 已经存在 country 信息
        if (fileExists.countryPath) {
            return JSON.parse(fs.readFileSync(countryPath));
        } else {
            // request country
            return Promise.all(urls.filter(x => x.url.length > 0).map(function(item) {
                return newRequestPromise(item.url);
            }))
        }

    }).then(function(respResults) {
        let urls = [];
        if (!fileExists.countryPath) {
            respResults.forEach(function(item, index) {
                urls = urls.concat(parseCountry(iconv.decode(item[1], 'gb2312'), absolutePath(item[0].request.href)));
            });
            fs.writeFileSync(countryPath, JSON.stringify(urls));
        } else {
            //已经存在表示已经爬取到了 country 信息
            urls = respResults;
        }

        // 已经存在 town 信息
        if (fileExists.townPath) {
            return JSON.parse(fs.readFileSync(townPath));
        } else {
            // request town
            return Promise.all(urls.filter(x => x.url.length > 0).map(function(item) {
                return newRequestPromise(item.url);
            }))
        }
    }).then(function(respResults) {
        let urls = [];
        if (!fileExists.townPath) {
            respResults.forEach(function(item, index) {
                urls = urls.concat(parseTown(iconv.decode(item[1], 'gb2312'), absolutePath(item[0].request.href)));
            });

            fs.writeFileSync(townPath, JSON.stringify(urls));
        } else {
            urls = respResults;
        }

        if (fileExists.villagePath) {
            return JSON.parse(fs.readFileSync(villagePath))
        } else {
            // request village
            return Promise.all(urls.filter(x => x.url.length > 0).map(function(item) {
                return newRequestPromise(item.url);
            }))
        }
    }).then(function(respResults) {
        let urls = [];
        if (!fileExists.villagePath) {
            respResults.forEach(function(item, index) {
                urls = urls.concat(parseVillage(iconv.decode(item[1], 'gb2312')));
            });
            fs.writeFileSync('src/village.json', JSON.stringify(urls));
        }

    }).catch(function(error) {
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
        log.debug(element)
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

    // log.debug(result);

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


// main();


function pullTownData(){
    JSON.parse(fs.readFileSync(countryPath)).slice(0, 1).forEach(function(element, index) {
        let urls = [];
        requestSync({
            url: element.url,
            encoding: null
        }, function(error, response, body){
            urls = JSON.parse(fs.readFileSync(townPath));
            urls = urls.concat(parseTown(iconv.decode(body, 'gb2312'), absolutePath(element.url)));
            fs.writeFileSync(townPath, JSON.stringify(urls));
        });
        // newRequestPromise(element.url).spread(function(response, body){
        //     urls.concat(parseTown(iconv.decode(body, 'gb2312'), absolutePath(response.element.href)));
        // });
    });
}
