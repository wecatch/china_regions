var provinceNode = document.querySelectorAll("p.MsoNormal b span");
var provinceArray = [];
provinceNode.forEach(function(i, index){
    var length = provinceArray.length;
    if(length === 0){
        provinceArray.push({
            "id": i.outerText,
            "name": ''
        })
    }else if(!provinceArray[length-1].name){
        if(i.outerText.trim()){
            provinceArray[length-1].name = i.outerText;
        }
    }else {
        if(i.outerText.trim()){
            provinceArray.push({
                "id": i.outerText,
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
