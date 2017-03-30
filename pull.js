var provinceNode = document.querySelectorAll("p.MsoNormal b span");
var provinceArray = [];
provinceNode.forEach(function(i, index){
    var length = provinceArray.length;
    if(length === 0){
        provinceArray.push({
            "id": i.outerText.trim(),
            "name": ''
        })
    }else if(!provinceArray[length-1].name){
        if(i.outerText.trim()){
            provinceArray[length-1].name = i.outerText.trim();
        }
    }else {
        if(i.outerText.trim()){
            provinceArray.push({
                "id": i.outerText.trim(),
                "name": ''
            })
        }
    }
});

var cityNode = document.querySelectorAll("p.MsoNormal>span");
var cityArray = [];
cityNode.forEach(function(i, index){
    var length = cityArray.length;
    if(length === 0){
        if (i.outerText.trim()){
            cityArray.push({
                "id": i.outerText.trim(),
                "name": ''
            })
        }
    }else if(!cityArray[length-1].name){
        if(i.outerText.trim()){
            cityArray[length-1].name = i.outerText.trim();
        }
    }else {
        if(i.outerText.trim()){
            cityArray.push({
                "id": i.outerText.trim(),
                "name": ''
            })
        }
    }
});

(function(console){

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console)


console.save(JSON.stringify(cityArray), 'city.json')
