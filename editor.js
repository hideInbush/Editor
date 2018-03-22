(function(){
    /**
     * @description 拖动 + 变换
     */
    document.querySelector('.stage').onmousedown = function(e){
        var element = e.target || e.srcElement;

        if(element.className.indexOf('dot') > -1){
            /**
             * 判断是否在边缘的小正方形上
             */
            var blockFlag = element.getAttribute('data-blockflag');
            if(blockFlag == 'true'){
                var drag = _domHelper.findParentNodeByClass(element, 'block');
            }else{
                var drag = _domHelper.findParentNodeByClass(element, 'cmp-wrapper');
            }
            if(drag.getAttribute('data-editable') == 'true'){
                return;
            }
            resizeCmp(e, drag, blockFlag);
        }else{
            var drag = _domHelper.findParentNodeByClass(element, 'cmp-wrapper');
            if(drag.tagName.toLocaleLowerCase() == 'body'){
                /**
                 * @description 点击在空白处
                 */
                var elements = document.querySelectorAll('.cmp-wrapper');
                for(var i=0; i<elements.length; i++){
                    if(elements[i].querySelector('.cmp-operate').children[0].style.display == 'block'){
                        elements[i].querySelector('.cmp-operate').children[0].style.display = 'none';
                        elements[i].querySelector('.cmpMain').setAttribute('contenteditable', 'false');
                        elements[i].setAttribute('data-editable', 'false');
                    }
                }
                updateDetailBar(drag, 'clear');
            }else{
                if(drag.getAttribute('data-editable') == 'true'){
                    return;
                }

                var elements = document.querySelectorAll('.cmp-wrapper');
                for(var i=0; i<elements.length; i++){
                    if(elements[i].querySelector('.cmp-operate').children[0].style.display == 'block'){
                        elements[i].querySelector('.cmp-operate').children[0].style.display = 'none';
                        elements[i].querySelector('.cmpMain').setAttribute('contenteditable', 'false');
                        elements[i].setAttribute('data-editable', 'false');
                    }
                }
                drag.querySelector('.cmp-operate').children[0].style.display = 'block';
                dragAndDrop(e, drag);
            }
        }
    }

    document.querySelector('.stage').ondblclick = function(e){
        var element = e.target || e.srcElement;
        if(element.getAttribute('contenteditable') == 'false'){
            element.setAttribute('contenteditable', 'true');
            var drag = _domHelper.findParentNodeByClass(element, 'cmp-wrapper');
            drag.setAttribute('data-editable', 'true');
        }
    }

    document.querySelector('.sideBar').querySelector('.res-panel-nav').onclick = function(e){
        var element = e.target || e.srcElement;
        if(element.getAttribute('data-id')){
            var num = parseInt(element.getAttribute('data-id'));
            document.querySelector('.sideBar').querySelector('.res-panel-nav').querySelector('.active').className = document.querySelector('.sideBar').querySelector('.res-panel-nav').querySelector('.active').className.replace('active','');
            element.className += ' active';
            document.querySelector('.sideBar').querySelector('.res-panel-lib').querySelector('.active').className = document.querySelector('.sideBar').querySelector('.res-panel-lib').querySelector('.active').className.replace('active','');
            document.querySelector('.sideBar').querySelector('.res-panel-lib').children[num].className += ' active';
        }
    }

    document.querySelector('.sideBar').querySelector('.res-panel-lib').onclick = function(e){
        var element = e.target || e.srcElement;
        if(element.getAttribute('data-type') == 'text' || 
            element.parentNode.getAttribute('data-type') == 'text' ||
            element.parentNode.parentNode.getAttribute('data-type') == 'text'){
            
            insertText(document.querySelector('.stage').children[3]);
        }else if(element.getAttribute('data-type') == 'image' || 
                element.parentNode.getAttribute('data-type') == 'image' ||
                element.parentNode.parentNode.getAttribute('data-type') == 'image'){
            var num = parseInt(element.parentNode.getAttribute('data-id') || element.parentNode.getAttribute('data-id') || element.parentNode.parentNode.getAttribute('data-id'));
            var lib = document.querySelector('.res-panel-lib');
            lib.querySelector('.active').className = lib.querySelector('.active').className.replace('active','');
            lib.children[num].className += ' active';
        }else if(element.getAttribute('data-type') == 'line' || 
                element.parentNode.getAttribute('data-type') == 'line' ||
                element.parentNode.parentNode.getAttribute('data-type') == 'line'){
            
            insertLine(document.querySelector('.stage').children[3]);
        }else if(element.getAttribute('data-type') == 'image-item' ||
                element.parentNode.getAttribute('data-type') == 'image-item'){
            
            var src = element.getAttribute('data-src') || element.parentNode.getAttribute('data-src');
            insertImage(document.querySelector('.stage').children[3], src);
        }
    }

    document.querySelector('.editor-header').onclick = function(e){
        var element = e.target || e.srcElement;
        if(element.getAttribute('data-btn') == 'save'){
            var stage = document.querySelector('.stage');
            var blockHeader = stage.querySelector('.block-header');
            var blockBody = stage.querySelector('.block-body');
            var blockBottom = stage.querySelector('.block-bottom');
            var cmp = stage.querySelectorAll('.cmp-wrapper');

            var cmps = [];
            for(var i=0; i<cmp.length; i++){
                cmps.push(cmp[i]);
            }

            var headerPosition = [0, parseFloat(window.getComputedStyle(blockHeader).height)];
            var bodyPosition = [parseFloat(headerPosition[1]), parseFloat(headerPosition[1])+parseFloat(window.getComputedStyle(blockBody).height)];
            var bottomPosition = [parseFloat(bodyPosition[1]), parseFloat(bodyPosition[1])+parseFloat(window.getComputedStyle(blockBottom).height)];
            
            debugger
        }else if(element.getAttribute('data-btn') == 'preview'){
        }
    }

    document.querySelector('.positionPanel').onchange = function(e){
        var element = e.target || e.srcElement;
        var stage = document.querySelector('.stage');
        var cmp = stage.querySelector('.checked').parentNode;
        if(element.getAttribute('data-type') == 'x'){
            cmp.style.left = parseFloat(element.value) + 'px';
        }else if(element.getAttribute('data-type') == 'y'){
            cmp.style.top = parseFloat(element.value) + 'px';
        }else if(element.getAttribute('data-type') == 'w'){
            cmp.style.width = parseFloat(element.value) + 'px';
        }else if(element.getAttribute('data-type') == 'h'){
            cmp.style.height = parseFloat(element.value) + 'px';
        }
    }

    /**
     * @description 自由变换大小
     * @param {e} event
     * @param {element} dom元素
     * @param {blockFlag} 是否为三部分模块
     */
    function resizeCmp(e, element, blockFlag){
        var editFlag = false;
        // _commonPieces.commonPieces.forbidEnd();
        var a = 0,
            b = 0;
        var e = e || window.event; //兼容ie浏览器  
        var target = e.target || e.srcElement,
            direction = target.getAttribute("data-direction");
        // var cmpDrawWrapper = target.parentNode.parentNode.parentNode;
        var cmpDrawWrapper = element;
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
            updateDetailBar(element, blockFlag == 'true' ? 'block' : '');

            var e = e || event;
            var newX = e.clientX,
                newY = e.clientY,
                newL = oBoxL,
                newT = oBoxT;
            if (direction == 'right') {
                newW = oBoxW + (newX - oldX);
                if (parseFloat(newW) <= 5 || parseFloat(newW) + oBoxL > parseFloat(containerW)) {
                    return;
                };
            };
            if (direction == 'left') {
                newW = oBoxW + (oldX - newX);
                if (parseFloat(newW) <= 5 || newX - oldX + oBoxL < 0 || parseFloat(newW) + Math.abs(newX - oldX + oBoxL) > parseFloat(containerW)) {
                    return;
                };
                newL = newX - oldX + oBoxL;
            };
            if (direction == 'top') {
                newH = oBoxH + (oldY - newY);
                if (parseFloat(newH) <= 5 || parseFloat(newH) + Math.abs(newY - oldY + oBoxT) > parseFloat(containerH)) {
                    return;
                };
                newT = newY - oldY + oBoxT;
                // cmpDrawWrapper.style.top= newY - oldY + oBoxT + 'px';
            };
            if (direction == 'bottom') {
                newH = oBoxH + (newY - oldY);
                if (parseFloat(newH) <= 5 || parseFloat(newH) + oBoxT > parseFloat(containerH)) {
                    // newY - oldY + oBoxT < 0 ||
                    return;
                };
            };
            if (direction == 'rightTop') {
                newW = oBoxW + (newX - oldX);
                newH = oBoxH + (oldY - newY);
                if (parseFloat(newH) <= 5 || parseFloat(newW) <= 5 || parseFloat(newW) + oBoxL > parseFloat(containerW) || newY - oldY + oBoxT < 0 || parseFloat(newH) + Math.abs(newY - oldY + oBoxT) > parseFloat(containerH)) {
                    return;
                }
                newT = newY - oldY + oBoxT;
            };
            if (direction == 'leftBottom') {
                newW = oBoxW + (oldX - newX);
                newH = oBoxH + (newY - oldY);
                if (parseFloat(newH) <= 5 || parseFloat(newW) <= 5 || newX - oldX + oBoxL < 0 || parseFloat(newW) + Math.abs(newX - oldX + oBoxL) > parseFloat(containerW) || parseFloat(newH) + oBoxT > parseFloat(containerH)) {
                    return;
                };
                newL = newX - oldX + oBoxL;
            };
            if (direction == 'leftTop') {
                newW = oBoxW + (oldX - newX);
                newH = oBoxH + (oldY - newY);
                if (parseFloat(newH) <= 5 || parseFloat(newW) <= 5 || newX - oldX + oBoxL < 0 || parseFloat(newW) + Math.abs(newX - oldX + oBoxL) > parseFloat(containerW) || newY - oldY + oBoxT < 0 || parseFloat(newH) + Math.abs(newY - oldY + oBoxT) > parseFloat(containerH)) {
                    return;
                };
                newL = newX - oldX + oBoxL;
                newT = newY - oldY + oBoxT;
            };
            if (direction == 'rightBottom') {
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

            // cmpRender.style.width = newW + 'px';
            // cmpRender.style.height = newH + 'px';
            // cmpRender.style.cssText += calPosStr;

            // cmpOperate.style.width = newW + 'px';
            // cmpOperate.style.height = newH + 'px';
            // cmpOperate.style.cssText += calPosStr;

            blockFlag == 'true' && (element.style.top = 0);

            if(element.className.indexOf('block-header') > -1){
                resizeThreeBlock('header');
            }else if(element.className.indexOf('block-body') > -1){
                resizeThreeBlock('body', direction);
            }else if(element.className.indexOf('block-bottom') > -1){
                resizeThreeBlock('bottom');
            }
            return false;
        };
        document.onmouseup = function () {
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
            var stage = document.querySelector('.stage');
            var left = e.clientX - diffX;
            var top = e.clientY - diffY;
            //控制拖拽物体的范围只能在浏览器视窗内，不允许出现滚动条  
            if (left < 0) {
                left = 0;
            } else if (left > parseFloat(stage.offsetWidth) - parseFloat(drag.offsetWidth)) {
                // left = parseFloat(drag.style.width) - parseFloat(drag.offsetWidth);
                left = parseFloat(stage.offsetWidth) - parseFloat(drag.offsetWidth);
            };
            if (top < 0) {
                top = 0;
            } else if (top > parseFloat(stage.offsetHeight) - parseFloat(drag.offsetHeight)) {
                top = parseFloat(stage.style.height) - parseFloat(drag.offsetHeight);
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
     * @description 生成文本
     * @param {}
     */
    function insertText(container){
        var left = parseInt(window.getComputedStyle(container).width) / 2 + 'px';
        var top = parseInt(window.getComputedStyle(container).height) / 2 + 'px';
        var textHtml = '<div class="cmp-wrapper" data-type="text" data-editable="true" style="left:'+left+';top:'+top+';width:100px;height:20px;color:#ff0000;background-color:#fff;font-family:"SimSun";font-weight:200;">\
                            <div class="cmp-render" style="width:100%;height:100%;">\
                                <div class="cmpScaleArea">\
                                    <div contenteditable="true" data-type="logo" class="cmpMain">文本</div>\
                                </div>\
                            </div>\
                            <div class="cmp-operate checked" data-type="logo" style="width:100%;height:100%;">\
                                <div style="display: block;">\
                                    <div class="borderLine"></div>\
                                    <div class="borderLine dashed"></div>\
                                    <div class="dot dot-e" data-direction="right"></div>\
                                    <div class="dot dot-w" data-direction="left"></div>\
                                </div>\
                            </div>\
                        </div>';

        container.innerHTML += textHtml;
    }

    /**
     * @description 生成图片
     * @param {}
     */
    function insertImage(container, src){
        var left = parseInt(window.getComputedStyle(container).width) / 2 + 'px';
        var top = parseInt(window.getComputedStyle(container).height) / 2 + 'px';
        var textHtml = '<div class="cmp-wrapper" data-type="image" data-editable="true" style="left:'+left+';top:'+top+';width:250px;height:150px;color:#ff0000;background-color:#fff;font-family:"SimSun";font-weight:200;">\
                            <div class="cmp-render" style="width:100%;height:100%;">\
                                <div class="cmpScaleArea">\
                                    <img class="cmpMain" style="width:100%;" src="'+src+'"/>\
                                </div>\
                            </div>\
                            <div class="cmp-operate checked" data-type="logo" style="width:100%;height:100%;">\
                                <div style="display: block;">\
                                    <div class="borderLine"></div>\
                                    <div class="borderLine dashed"></div>\
                                    <div class="dot dot-n" data-direction="top"></div>\
                                    <div class="dot dot-s" data-direction="bottom"></div>\
                                    <div class="dot dot-e" data-direction="right"></div>\
                                    <div class="dot dot-w" data-direction="left"></div>\
                                    <div class="dot dot-nw" data-direction="leftTop"></div>\
                                    <div class="dot dot-ne" data-direction="rightTop"></div>\
                                    <div class="dot dot-sw" data-direction="leftBottom"></div>\
                                    <div class="dot dot-se" data-direction="rightBottom"></div>\
                                </div>\
                            </div>\
                        </div>';

        container.innerHTML += textHtml;
    }

    /**
     * @description 生成线条
     * @param {}
     */
    function insertLine(container){
        var left = parseInt(window.getComputedStyle(container).width) / 2 + 'px';
        var top = parseInt(window.getComputedStyle(container).height) / 2 + 'px';
        var textHtml = '<div class="cmp-wrapper" data-type="line" data-editable="true" style="left:'+left+';top:'+top+';width:100px;height:2px;color:#ff0000;background-color:#fff;font-family:"SimSun";font-weight:200;">\
                            <div class="cmp-render" style="width:100%;height:100%;">\
                                <div class="cmpScaleArea">\
                                    <div style="background-color:#333;width:100%;" class="cmpMain"></div>\
                                </div>\
                            </div>\
                            <div class="cmp-operate checked" data-type="logo" style="width:100%;height:100%;">\
                                <div style="display: block;">\
                                    <div class="borderLine"></div>\
                                    <div class="borderLine dashed"></div>\
                                    <div class="dot dot-e" data-direction="right"></div>\
                                    <div class="dot dot-w" data-direction="left"></div>\
                                </div>\
                            </div>\
                        </div>';

        container.innerHTML += textHtml;
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
    renderSelect(viewSelect, document.querySelector('.viewPanel'), 'block');

    var fontMap_1 = {
        'SimSun' : '宋体',
        'SimHei' : '黑体',
        'Microsoft Yahei' : '微软雅黑',
    };
    var fontMap_2 = {
        '宋体' : 'SimSun',
        '黑体' : 'SimHei',
        '微软雅黑' : 'Microsoft Yahei',
    };
    var fontSelect = {
        default: '',
        content: [
            '宋体',//SimSun
            '黑体',//SimHei
            '微软雅黑'//Microsoft Yahei
        ]
    };
    var sizeSelect = {
        default: '',
        content: [
            '14',
            '16',
            '18',
            '20'
        ]
    };
    var thickSelect = {
        default: '',
        content: [
            '200',
            '300',
            '400',
            '500',
            '600'
        ]
    };
    renderSelect(fontSelect, document.querySelector('.select-font'), 'font');
    renderSelect(sizeSelect, document.querySelector('.select-size'), 'size');
    renderSelect(thickSelect, document.querySelector('.select-thick'), 'weight');
    
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

                var stage = document.querySelector('.stage');
                var cmp = stage.querySelector('.checked').parentNode;

                if(type == 'block'){
                    var header = stage.querySelector('.block-header');
                    var body = stage.querySelector('.block-body');
                    var bottom = stage.querySelector('.block-bottom');
                    
                    stage.querySelector('.active').className = document.querySelector('.stage').querySelector('.active').className.replace('active', '');
                    if(input.value == '头部编辑'){
                        header.className += ' active';
                        updateDetailBar(header, 'block');
                    }else if(input.value == '正文编辑'){
                        body.className += ' active';
                        updateDetailBar(body, 'block');
                    }else if(input.value == '尾部编辑'){
                        bottom.className += ' active';
                        updateDetailBar(bottom, 'block');
                    }
                }else if(type == 'font'){
                    cmp.style.fontFamily = fontMap_2[input.value] || input.value;
                }else if(type == 'size'){
                    cmp.style.fontSize = parseInt(input.value) + 'px';
                }else if(type == 'weight'){
                    cmp.style.fontWeight = input.value;
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
    function updateDetailBar(element, type){
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

        /**
         * clear all status
         */
        bgColorPanel.children[0].style.backgroundColor = '';
        bgColorPanel.children[1].value = '';
        fontColorPanel.children[0].style.backgroundColor = '';
        fontColorPanel.children[1].value = '';
        fontPanel.querySelector('input').value = '';
        sizePanel.querySelector('input').value = '';
        thickPanel.querySelector('input').value = '';
        
        positionX.children[1].value = '';
        positionY.children[1].value = '';
        sizeW.children[1].value = '';
        sizeH.children[1].value = '';

        if(type == 'block'){
            sizeW.children[1].value = parseInt(element.style.width || window.getComputedStyle(element).width);
            sizeH.children[1].value = parseInt(element.style.height || window.getComputedStyle(element).height) ;
        }else if(type == 'clear'){
        }else{
            bgColorPanel.children[0].style.backgroundColor = element.style.backgroundColor;
            bgColorPanel.children[1].value = _colorHelper.colorHex(element.style.backgroundColor);
            fontColorPanel.children[0].style.backgroundColor = element.style.color;
            fontColorPanel.children[1].value = _colorHelper.colorHex(element.style.color);
            fontPanel.querySelector('input').value = fontMap_1[window.getComputedStyle(element).fontFamily] || window.getComputedStyle(element).fontFamily;
            sizePanel.querySelector('input').value = parseInt(window.getComputedStyle(element).fontSize);
            thickPanel.querySelector('input').value = parseInt(window.getComputedStyle(element).fontWeight);
            
            positionX.children[1].value = parseInt(element.style.left);
            positionY.children[1].value = parseInt(element.style.top);
            sizeW.children[1].value = parseInt(element.style.width);
            sizeH.children[1].value = parseInt(element.style.height);
        }
        
    }
    

    /**
     * @description 动态更新头部、正文、底部三块高度大小
     * @param {block} 当前不变化的部分
     */
    function resizeThreeBlock(block, direction){
        var stage = document.querySelector('.stage');
        var header = document.querySelector('.block-header');
        var body = document.querySelector('.block-body');
        var bottom = document.querySelector('.block-bottom');
        
        var stageHeight = parseFloat(window.getComputedStyle(stage).height);
        var headerHeight = parseFloat(window.getComputedStyle(header).height);
        var bodyHeight = parseFloat(window.getComputedStyle(body).height);
        var bottomHeight = parseFloat(window.getComputedStyle(bottom).height);
        
        switch(block){
            case 'header':
                body.style.height = stageHeight - headerHeight - bottomHeight + 'px';
                break;
            case 'body':
                direction == 'top' && (header.style.height = stageHeight - bodyHeight - bottomHeight + 'px');
                direction == 'bottom' && (bottom.style.height = stageHeight - bodyHeight - headerHeight + 'px');
                break;
            case 'bottom':
                body.style.height = stageHeight - headerHeight - bottomHeight + 'px';
                break;
        }
    }

})();