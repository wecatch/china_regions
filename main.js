const fs = require("fs");
const iconv = require('iconv-lite');
const jsdom = require("jsdom");
const path = require("path");
const Promise = require("bluebird");
const log = require('tracer').console();
const request = Promise.promisifyAll(require("request"), {multiArgs: true});
const requestSync = require("request");
const sleep = require('system-sleep');



const host = "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/";
//这个 ip 是通过 dns 工具直接解析出来的，因为大量爬取需要进行多次 dns 解析，时间长了 nodejs 会报 dns 解析错误
//应该是有缓存的，但是还是报 dns 解析有问题，这个 ip 可能会变，在使用时可以实时解析一下统计局的网站域名，如果不使用 ip
//则把 IP 内容换成域名即可
// const IP = 'www.stats.gov.cn'
const IP = '219.235.129.117:80'


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
    url = url.replace('www.stats.gov.cn', IP);
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
const villagePathBackup = 'src/village_backup.json';

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
    //从省份开始爬取 有统计局的网站并发能力有限，使用 promise.All 爬完 country 级别的信息时服务器就连接不上了
    //代码里预制了从已经爬取到的文件中获取连接继续爬的能力
    //由于从 country 开始信息量已经很大了，一般服务器会直接报错 可以使用 pullTownDataSync 从本地文件读取 country 信息继续爬
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


function pullCountryDataSync() {
    let offset = 0
    JSON.parse(fs.readFileSync(cityPath)).slice(offset).forEach(function(element, index) {
        let urls = [];
        let url = element.url.replace('www.stats.gov.cn', IP);
        log.debug(url);
        if (url){
            requestSync({
                url: url,
                encoding: null
            }, function(error, response, body) {
                //空的文件内容必须是 []
                urls = JSON.parse(fs.readFileSync(countryPath) || []);
                urls = urls.concat(parseCountry(iconv.decode(body, 'gb2312'), absolutePath(element.url)));
                fs.writeFileSync(countryPath, JSON.stringify(urls));
                log.debug('foreach ==> ', offset + index);
            });
            sleep(500);
        }
    });
}


function pullTownDataSync() {
    let offset = 0
    JSON.parse(fs.readFileSync(countryPath)).slice(offset).forEach(function(element, index) {
        let urls = [];
        let url = element.url.replace('www.stats.gov.cn', IP);
        log.debug(url);
        if (url){
            requestSync({
                url: url,
                encoding: null
            }, function(error, response, body) {
                //空的文件内容必须是 []
                urls = JSON.parse(fs.readFileSync(townPath) || []);
                urls = urls.concat(parseTown(iconv.decode(body, 'gb2312'), absolutePath(element.url)));
                fs.writeFileSync(townPath, JSON.stringify(urls));
                log.debug('foreach ==> ', offset + index);
            });
            sleep(500);
        }
    });
}

//由于数据量很大，统计局的服务器在接受大量连接时会莫名 hang 住，所以通过输出 index，不断计算偏移量，方便下一次计算
//第一次从 0 开始，假如输出 index 是 3000，则下一次爬取时偏移量应该是 3001，可以通过 sleep 适当控制爬取的速度，sleep 是直接让 nodejs event loop 停住
function pullVillageDataSync() {
    let offset = 0
    JSON.parse(fs.readFileSync(townPath)).slice(offset).forEach(function(element, index) {
        // 该异常用于矫正偏移量的正确性
        // log.debug(element)
        // throw Error("offset error");
        fs.copyFileSync(villagePath, villagePathBackup)
        let urls = [];
        let url = element.url.replace('www.stats.gov.cn', IP);
        log.debug(element)
        if (url){
            requestSync({
                url: url,
                encoding: null
            }, function(error, response, body) {
                //空的文件内容必须是 []
                urls = JSON.parse(fs.readFileSync(villagePath) || []);
                urls = urls.concat(parseVillage(iconv.decode(body, 'gb2312')));
                fs.writeFileSync(villagePath, JSON.stringify(urls));
                log.debug('foreach ==> ', offset + index);
            });
            sleep(500);
        }
    });
}


// main();
// pullCountryDataSync();
// pullTownDataSync();
// pullVillageDataSync()