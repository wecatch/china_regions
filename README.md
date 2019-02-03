# china_regions

最全最新中国省，市，地区 json 及 sql 数据，自动抓取国标 http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/ 数据，并且自动生成 JavaScript es6 module 以及 sql 数据。

最新国标行政区规划最低到居委会这一级别了，行政区代码代码也变长了，而且不包含港澳台信息，按需所需不同的版本，见 https://github.com/wecatch/china_regions/releases

## 演示地址

http://wecatch.me/china_regions/

## 如何使用

数据分 json、es6 module、sql 三种格式存储，es6 module 和 sql 是根据 json 自动生成，json 数据又是根据最新国标生成，

```
├── json            # json 格式
├── mysql           # mysql sql 格式
├── postgresql      # postgresql 格式
```

直接拷贝 json 和 es6 文件可直接使用，也可以根据对应的语言生成不同的模块。


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
5. 利用已经爬取的 province、city、country 开始同步其他行政区域的信息，注释掉 main 函数根据需要分别打开 pullCountryDataSync、pullTownDataSync、pullVillageDataSync 爬取其他行政区域的信息，注释事项见函数注释
5. 最后执行 `python makedata.py` 生成各种格式文件


## 反馈

如果国标页面 html 结构发生变化，请提 issue。
