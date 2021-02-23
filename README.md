# china_regions

最全最新中国省，市，地区 json 及 sql 数据，自动抓取国标 http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/ 数据，并且自动生成 JavaScript es6 module 以及 sql 数据。

最新国标行政区规划最低到居委会这一级别了，行政区代码代码也变长了，不包含港澳台信息，按需所需不同的版本，见 https://github.com/wecatch/china_regions/releases

## 演示地址

http://wecatch.me/china_regions/

## 如何使用

数据分 json、es6 module、sql 三种格式存储，es6 module 和 sql 是根据 json 自动生成，json 数据又是根据最新国标生成，

```
├── js              # js module 格式
├── json            # json 格式
├── mysql           # mysql sql 格式
```

直接拷贝 json 和 es6 文件可直接使用，也可以根据对应的语言生成不同的模块。


Village 数据文件特别大，默认不包含在仓库中，可以 clone 仓库，在 src 中解压 village 的压缩文件，然后执行 `python makedata.py`


## 如何更新到最新国标

仓库中的现在的数据是根据最新国标生成，如果在使用中发现国标有变动，可以手动进行更新，需要有 node8 或更高环境:

1. git clone 本仓库
2. yarn install 或者 npm install
3. 移除 src 目录下的 json 文件：

```
    ├── city.json
    ├── country.json
    ├── province.json
    ├── source.json
    ├── town.json
    └── village.json
```

4. 打开 main.js 文件，取消对 main 函数执行的注释，开始执行 `node main.js`，一般情况下可以顺利爬取到 province、
city、country 的信息
5. 利用已经爬取的 province、city、country 开始同步其他行政区域的信息，注释掉 main 函数根据需要分别打开 pullTownDataSync、pullVillageDataSync 爬取其他行政区域的信息，注释事项见函数注释
6. 最后执行 `python makedata.py` 生成各种格式文件

## 注意事项

根据 town 爬取的 village 数据非常大，默认情况下不会自动生成 village 的信息，可以根据自己的需要 clone 仓库之后自己生成

行政级别顺序是:province-> city --> country --> town --> village，对应的是:省->市(市辖区)->县(区、市)->镇(街道)->村(居委会)

爬取 village 时由于数据量特别大会导致 nodejs 出现内存泄漏的情况，所以每次增量更新文件时会自动进行文件备份，生成 `src/village_backup.json` 备份文件不进仓库，最后再手动干预偏移量

village 的数据文件是压缩过的解压执行 `tar xvfz village.tar.gz .`

默认情况下不生成 village 这个级别的数据，如果需要请执行 `makedata.py` 


## 反馈

如果国标页面 html 结构发生变化，请提 issue。


## 更新记录

## 2021.2.23 

更新到 http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2020/index.html 2020 最新数据

## 2019.4.17

fix [#17](https://github.com/wecatch/china_regions/issues/17) 针对东莞市 中山市 儋州市三个不设区的市单独处理，
这三个市没有区，直接到镇 town，镇的上一级就是市，开发者可以根据自己的情况特殊处理，详见 `src/special_city.json`，SQL 数据包含在 town.sql 中

## 2019.4.9

- fix [#16](https://github.com/wecatch/china_regions/issues/16)

## 2019.3.10

- 更新数据生成的方式
- 校验数据生成是否准确 `cat src/village.json | grep id | wc -l` == `wc -l mysql/village.sql`

## 2019.2.11

- 更新数据抓取方式，使用 nodejs 抓取
- 更新数据到最新的 2018 国标
- 移除对 sqlite 以及 postgresql 的
