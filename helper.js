var _domHelper = {
    /**
     * @description 找到有指定class的父元素 
     * @param {element} 元素
     * @param {className} 标记类名
     * */
     findParentNodeByClass: function(element, className){
        if(!element){
            return element;
        }

        if(element.tagName.toLocaleLowerCase() == 'body'){
            return element;
        }

        while(element.className && element.className.indexOf(className) == -1){
            return _domHelper.findParentNodeByClass(element.parentNode, className);
        }
        return element;
    },
};

var _colorHelper = {
    /**
     * @description rgb颜色转为十六进制
     */
    colorHex: function(color){
        var that = color;
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是rgb颜色表示
        if (/^(rgb|RGB)/.test(that)) {
            var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i=0; i<aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                if (hex === "0") {
                    hex += hex;    
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = that;    
            }
            return strHex;
        } else if (reg.test(that)) {
            var aNum = that.replace(/#/,"").split("");
            if (aNum.length === 6) {
                return that;    
            } else if(aNum.length === 3) {
                var numHex = "#";
                for (var i=0; i<aNum.length; i+=1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        }
        return that;
    }
};
