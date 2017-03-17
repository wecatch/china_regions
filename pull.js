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
