# china_regions

最全最新中国省，市，地区 json 及 sql 数据，自动抓取国标 http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/index.html 数据，并且自动生成 JavaScript es6 module 以及 sql 数据。

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

仓库中的现在的数据是根据最新国标生成，如果在使用中发现国标有变动，可以手动进行更新。

用 chrome 访问 [国标](http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201703/t20170310_1471429.html)，打开浏览器控制台，粘贴 pull.js 代码并执行，然后会生成 city.json 文件，在仓库目录下执行 `mkdir src` 创建 src 目录，拷贝 city.json 至 src，打开 `makedata.py` 执行 `pull_data` 函数生成最新 json 数据，然后再执行 `main` 函数生成最新 sql 以及 es6 module 数据。


## 反馈

如果国标页面 html 结构发生变化，请提 issue。
