(function(){
    /**
     * @description 拖动 + 变换
     */
    document.querySelector('.stage').onmousedown = function(e){
        var element = e.target || e.srcElement;

        if(element.className.indexOf('dot-s') > -1 || element.className.indexOf('dot-n') > -1){
            var drag = _domHelper.findParentNodeByClass(element, 'view');
            resizeCmp(e, drag);
        }else if(element.className.indexOf('dot') > -1){
            /**
             * 判断是否在边缘的小正方形上
             */
            var drag = _domHelper.findParentNodeByClass(element, 'cmpDrawWrapper');
            resizeCmp(e, drag);
        }else{
            var drag = _domHelper.findParentNodeByClass(element, 'cmpDrawWrapper');
            if(drag.tagName.toLocaleLowerCase() == 'body'){
                /**
                 * @description 点击在空白处
                 */

                var elements = document.querySelectorAll('.cmpDrawWrapper');
                for(var i=0; i<elements.length; i++){
                    if(elements[i].querySelector('.cmpDrawOperate').children[0].style.display == 'block'){
                        elements[i].querySelector('.cmpDrawOperate').children[0].style.display = 'none';
                    }
                }
            }else{
                drag.querySelector('.cmpDrawOperate').children[0].style.display = 'block';
                dragAndDrop(e, drag);
            }
        }
    }


    /**
     * @description 自由变换大小
     * @param {}
     */
    function resizeCmp(e, drag){
        var editFlag = false;
        // _commonPieces.commonPieces.forbidEnd();
        var a = 0,
            b = 0;
        var e = e || window.event; //兼容ie浏览器  
        var target = e.target || e.srcElement,
            targetType = target.getAttribute("data-type");
        // var cmpDrawWrapper = target.parentNode.parentNode.parentNode;
        var cmpDrawWrapper = drag;
        var oldX = e.clientX,
            oldY = e.clientY;
        var oBoxW = parseFloat(window.getComputedStyle(cmpDrawWrapper).width),
            oBoxH = parseFloat(window.getComputedStyle(cmpDrawWrapper).height),
            oBoxL = parseFloat(window.getComputedStyle(cmpDrawWrapper).left),
            oBoxT = parseFloat(window.getComputedStyle(cmpDrawWrapper).top);
        var cmpRender = cmpDrawWrapper.children[0],
            cmpOperate = cmpDrawWrapper.children[1];
        var newW = oBoxW,
            newH = oBoxH;
        var containerH = cmpDrawWrapper.parentNode.parentNode.style.height,
            containerW = cmpDrawWrapper.parentNode.parentNode.style.width;
        document.onmousemove = function (e) {
            updateDetailBar(drag);

            var e = e || event;
            var newX = e.clientX,
                newY = e.clientY,
                newL = oBoxL,
                newT = oBoxT;
            if (targetType == 'right') {
                newW = oBoxW + (newX - oldX);
                if (parseFloat(newW) <= 5 || parseFloat(newW) + oBoxL > parseFloat(containerW)) {
                    return;
                };
            };
            if (targetType == 'left') {
                newW = oBoxW + (oldX - newX);
                if (parseFloat(newW) <= 5 || newX - oldX + oBoxL < 0 || parseFloat(newW) + Math.abs(newX - oldX + oBoxL) > parseFloat(containerW)) {
                    return;
                };
                newL = newX - oldX + oBoxL;
            };
            if (targetType == 'top') {
                newH = oBoxH + (oldY - newY);
                if (parseFloat(newH) <= 5 || parseFloat(newH) + Math.abs(newY - oldY + oBoxT) > parseFloat(containerH)) {
                    return;
                };
                newT = newY - oldY + oBoxT;
                cmpDrawWrapper.style.top = newY - oldY + oBoxT + 'px';
            };
            if (targetType == 'bottom') {
                newH = oBoxH + (newY - oldY);
                if (parseFloat(newH) <= 5 || parseFloat(newH) + oBoxT > parseFloat(containerH)) {
                    // newY - oldY + oBoxT < 0 ||
                    return;
                };
            };
            if (targetType == 'rightTop') {
                newW = oBoxW + (newX - oldX);
                newH = oBoxH + (oldY - newY);
                if (parseFloat(newH) <= 5 || parseFloat(newW) <= 5 || parseFloat(newW) + oBoxL > parseFloat(containerW) || newY - oldY + oBoxT < 0 || parseFloat(newH) + Math.abs(newY - oldY + oBoxT) > parseFloat(containerH)) {
                    return;
                }
                newT = newY - oldY + oBoxT;
            };
            if (targetType == 'leftBottom') {
                newW = oBoxW + (oldX - newX);
                newH = oBoxH + (newY - oldY);
                if (parseFloat(newH) <= 5 || parseFloat(newW) <= 5 || newX - oldX + oBoxL < 0 || parseFloat(newW) + Math.abs(newX - oldX + oBoxL) > parseFloat(containerW) || parseFloat(newH) + oBoxT > parseFloat(containerH)) {
                    return;
                };
                newL = newX - oldX + oBoxL;
            };
            if (targetType == 'leftTop') {
                newW = oBoxW + (oldX - newX);
                newH = oBoxH + (oldY - newY);
                if (parseFloat(newH) <= 5 || parseFloat(newW) <= 5 || newX - oldX + oBoxL < 0 || parseFloat(newW) + Math.abs(newX - oldX + oBoxL) > parseFloat(containerW) || newY - oldY + oBoxT < 0 || parseFloat(newH) + Math.abs(newY - oldY + oBoxT) > parseFloat(containerH)) {
                    return;
                };
                newL = newX - oldX + oBoxL;
                newT = newY - oldY + oBoxT;
            };
            if (targetType == 'rightBottom') {
                newW = oBoxW + (newX - oldX);
                newH = oBoxH + (newY - oldY);
                if (parseFloat(newW) <= 5 || parseFloat(newH) <= 5 || parseFloat(newW) + oBoxL > parseFloat(containerW) || parseFloat(newH) + oBoxT > parseFloat(containerH)) {
                    return;
                };
            };
            var calPosStr = "margin-left:" + -parseFloat(newW) / 2 + "px;" + "margin-top:" + -parseFloat(newH) / 2 + "px;";
            cmpDrawWrapper.style.width = newW + 'px';
            cmpDrawWrapper.style.height = newH + 'px';
            cmpDrawWrapper.style.left = newL + 'px';
            cmpDrawWrapper.style.top = newT + 'px';

            cmpRender.style.width = newW + 'px';
            cmpRender.style.height = newH + 'px';
            // cmpRender.style.cssText += calPosStr;

            cmpOperate.style.width = newW + 'px';
            cmpOperate.style.height = newH + 'px';
            // cmpOperate.style.cssText += calPosStr;

            // editingCmpAttr.x = newL;
            // editingCmpAttr.y = newT;
            // editingCmpAttr.width = newW;
            // editingCmpAttr.height = newH;
            // editingWrapper.setAttribute("data-attr", JSON.stringify(editingCmpAttr));
            // modelEditFuncs.controlPanelPosChange();
            editFlag = true;
            return false;
        };
        document.onmouseup = function () {
            if (editFlag) {
                // modelEditFuncs.historyCanvas.push(modelEditFuncs.modelEditorCanvasArea.innerHTML);
                editFlag = false;
            };
            document.onmousedown = null;
            document.onmousemove = null;

        };
    }

    /**
     * @description 拖动
     * @param {e} event
     * @param {element} dom元素
     */
    function dragAndDrop(e, drag){
        //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离  
        diffX = e.clientX - drag.offsetLeft; 
        diffY = e.clientY - drag.offsetTop;

        updateDetailBar(drag);

        /*低版本ie bug*/
        if (typeof drag.setCapture != 'undefined') {
            drag.setCapture();
        }
        document.onmousemove = function (e) {
            var e = e || window.event; //兼容ie浏览器  
            var left = e.clientX - diffX;
            var top = e.clientY - diffY;
            //控制拖拽物体的范围只能在浏览器视窗内，不允许出现滚动条  
            if (left < 0) {
                left = 0;
            } else if (left > parseFloat(drag.parentNode.offsetWidth) - parseFloat(drag.offsetWidth)) {
                // left = parseFloat(drag.style.width) - parseFloat(drag.offsetWidth);
                left = parseFloat(drag.parentNode.offsetWidth) - parseFloat(drag.offsetWidth);
            };
            if (top < 0) {
                top = 0;
            } else if (top > parseFloat(drag.parentNode.offsetHeight) - parseFloat(drag.offsetHeight)) {
                top = parseFloat(drag.parentNode.style.height) - parseFloat(drag.offsetHeight);
            };
            //移动时重新得到物体的距离，解决拖动时出现晃动的现象  
            drag.style.left = left + 'px';
            drag.style.top = top + 'px';
            // editingCmpAttr.x = left;
            // editingCmpAttr.y = top;
            // editingWrapper.setAttribute("data-attr", JSON.stringify(editingCmpAttr));
            // modelEditFuncs.controlPanelPosChange();
            // eidtFalg = true;
            //阻止浏览器自带的拖动

            updateDetailBar(drag);

            return false;
        };
        document.onmouseup = function (e) {
            // if (eidtFalg) {
            //     modelEditFuncs.historyCanvas.push(modelEditFuncs.modelEditorCanvasArea.innerHTML);
            //     eidtFalg = false;
            // };
            this.onmousemove = null;
            this.onmouseup = null; //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
            //修复低版本ie bug  
            if (typeof drag.releaseCapture != 'undefined') {
                drag.releaseCapture();
            }
        };
    }

    /**
     * 构建几个下拉框
     */
    var viewSelect = {
        default: '头部编辑',
        content: [
            '头部编辑',
            '正文编辑',
            '尾部编辑',
        ]
    };
    renderSelect(viewSelect, document.querySelector('.viewPanel'), 'viewPart');

    var fontSelect = {
        default: '',
        content: [
            '宋体',
            '微软雅黑'
        ]
    };
    var sizeSelect = {
        default: '',
        content: [
            '15',
            '20'
        ]
    };
    var thickSelect = {
        default: '',
        content: [
            '300',
            '500'
        ]
    };
    renderSelect(fontSelect, document.querySelector('.select-font'));
    renderSelect(sizeSelect, document.querySelector('.select-size'));
    renderSelect(thickSelect, document.querySelector('.select-thick'));
    
    /**
     * @description 生成下拉框组件
     * @param {dom} 渲染的目标元素 
     */
    function renderSelect(data, targetDom, type){
        var items = '';
        data.content.forEach(function(v){
            items += '<li data-name="'+v+'" class="labelCursor">'+v+'</li>';
        })

        var tpl = '<div class="selectPanel">\
                        <div>\
                            <input data-status="expand" readonly="readonly" value="'+data.default+'"/>\
                            <i class="fa fa-angle-down" aria-hidden="true"></i>\
                        </div>\
                        <ul style="display:none;">'+items+'</ul>\
                    </div>';

        targetDom.innerHTML += tpl;

        /**
         * @desc 绑定事件
         */
        targetDom.lastElementChild.onmousedown = function(e){
            var element = e.target || e.srcElement;
            if(element.getAttribute('data-status') == 'expand'){
                var ul = element.parentNode.nextElementSibling;
                var arrow = element.nextElementSibling;

                ul.style.display = 'block';
                arrow.style.transform = 'rotate(180deg)';
                element.setAttribute('data-status', 'collapse');
            }else if(element.getAttribute('data-status') == 'collapse'){
                var ul = element.nextElementSibling;
                var arrow = element.nextElementSibling;

                ul.style.display = 'none';
                arrow.style.transform = 'rotate(0)';
                element.setAttribute('data-status', 'expand');
            }else if(element.getAttribute('data-name')){
                var input = element.parentNode.previousElementSibling.children[0];
                input.value = element.getAttribute('data-name');

                if(type == 'viewPart'){
                    var stage = document.querySelector('.stage');
                    var header = stage.querySelector('.header');
                    var body = stage.querySelector('.body');
                    var bottom = stage.querySelector('.bottom');
                    
                    stage.querySelector('.active').className = document.querySelector('.stage').querySelector('.active').className.replace('active', '');
                    if(input.value == '头部编辑'){
                        header.className += ' active';

                        header.style.width = parseFloat(window.getComputedStyle(stage).width) + 'px';
                        header.style.height = parseFloat(window.getComputedStyle(stage).height) - parseFloat(window.getComputedStyle(body).height) - parseFloat(window.getComputedStyle(bottom).height) + 'px';
                    }else if(input.value == '正文编辑'){
                        body.className += ' active';

                        body.style.width = parseFloat(window.getComputedStyle(stage).width) + 'px';
                        body.style.height = parseFloat(window.getComputedStyle(stage).height) - parseFloat(window.getComputedStyle(header).height) - parseFloat(window.getComputedStyle(bottom).height) + 'px';
                    }else if(input.value == '尾部编辑'){
                        bottom.className += ' active';

                        bottom.style.width = parseFloat(window.getComputedStyle(stage).width) + 'px';
                        bottom.style.height = parseFloat(window.getComputedStyle(stage).height) - parseFloat(window.getComputedStyle(header).height) - parseFloat(window.getComputedStyle(body).height) + 'px';
                    }
                }
            }
        }

        /**
         * @desc 失焦事件
         */
        targetDom.lastElementChild.querySelector('input').onblur = function(e){
            var element = e.target || e.srcElement;
            var ul = element.parentNode.nextElementSibling;
            var arrow = element.nextElementSibling;
            
            ul.style.display = 'none';
            arrow.style.transform = 'rotate(0)';
            element.setAttribute('data-status', 'expand');
        }
    }

    /**
     * @description 更新右侧设置信息
     * @param {element} dom元素
     */
    function updateDetailBar(element){
        var detailBar = document.querySelector('.detailBar');
        var bgColorPanel = detailBar.querySelectorAll('.colorPanel')[0];
        var fontColorPanel = detailBar.querySelectorAll('.colorPanel')[1];
        var fontPanel = detailBar.querySelector('.select-font');
        var sizePanel = detailBar.querySelector('.select-size');
        var thickPanel = detailBar.querySelector('.select-thick');
        
        var positionX = detailBar.querySelector('.positionX');
        var positionY = detailBar.querySelector('.positionY');
        var sizeW = detailBar.querySelector('.sizeW');
        var sizeH = detailBar.querySelector('.sizeH');
        
        bgColorPanel.children[0].style.backgroundColor = element.style.backgroundColor;
        bgColorPanel.children[1].value = _colorHelper.colorHex(element.style.backgroundColor);
        fontColorPanel.children[0].style.backgroundColor = element.style.color;
        fontColorPanel.children[1].value = _colorHelper.colorHex(element.style.color);
        fontPanel.querySelector('input').value = window.getComputedStyle(element).fontFamily;
        sizePanel.querySelector('input').value = parseInt(window.getComputedStyle(element).fontSize);
        thickPanel.querySelector('input').value = parseInt(window.getComputedStyle(element).fontWeight);
        
        positionX.children[1].value = parseInt(element.style.left);
        positionY.children[1].value = parseInt(element.style.top);
        sizeW.children[1].value = parseInt(element.style.width);
        sizeH.children[1].value = parseInt(element.style.height);
        
    }
    
})();