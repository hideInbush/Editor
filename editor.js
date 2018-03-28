(function(){
    /**
     * @description 拖动 + 变换
     */
    document.querySelector('.stage').addEventListener('mousedown', function(e){
        var element = e.target || e.srcElement;

        if(e.buttons == '1'){
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
                        if(elements[i].className.indexOf('checked') > -1){
                            elements[i].className = elements[i].className.replace(/checked/g,'');
                        }

                        if(elements[i].querySelector('.cmp-operate').children[0].style.display == 'block'){
                            elements[i].querySelector('.cmp-operate').children[0].style.display = 'none';
                            elements[i].querySelector('.cmpMain').setAttribute('contenteditable', 'false');
                            elements[i].setAttribute('data-editable', 'false');
                        }
                    }

                    document.querySelector('.modal-menu').style.display = 'none';
                    
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
                    drag.className += ' checked';
                    drag.querySelector('.cmp-operate').children[0].style.display = 'block';
                    dragAndDrop(e, drag);
                }
            }
        }else if(e.buttons == '2'){
            var drag = _domHelper.findParentNodeByClass(element, 'cmp-wrapper');

            var elements = document.querySelectorAll('.cmp-wrapper');
            for(var i=0; i<elements.length; i++){
                if(elements[i].className.indexOf('checked') > -1){
                    elements[i].className = elements[i].className.replace(/checked/g,'');
                }

                if(elements[i].querySelector('.cmp-operate').children[0].style.display == 'block'){
                    elements[i].querySelector('.cmp-operate').children[0].style.display = 'none';
                    elements[i].querySelector('.cmpMain').setAttribute('contenteditable', 'false');
                    elements[i].setAttribute('data-editable', 'false');
                }
            }

            if(drag.tagName.toLocaleLowerCase() != 'body'){
                document.querySelector('.modal-menu').style.display = 'block';
                document.querySelector('.modal-menu').style.left = e.pageX + 'px';
                document.querySelector('.modal-menu').style.top = e.pageY + 'px';

                drag.className += ' checked';
                drag.querySelector('.cmp-operate').children[0].style.display = 'block';
            }else{
                document.querySelector('.modal-menu').style.display = 'none';
            }
        }
    });

    document.querySelector('.stage').addEventListener('dblclick', function(e){
        var element = e.target || e.srcElement;
        element = _domHelper.findParentNodeByClass(element, 'cmp-wrapper');
        if(element.getAttribute('data-editable') == 'false' && element.getAttribute('data-type') == 'text'){
            element.setAttribute('data-editable', 'true');
            element.querySelector('.cmpScaleArea').children[0].setAttribute('contenteditable', 'true');
        }
    })

    document.querySelector('.sideBar').querySelector('.res-panel-nav').addEventListener('click', function(e){
        var element = e.target || e.srcElement;
        if(element.getAttribute('data-id') || element.parentNode.getAttribute('data-id')){
            element.parentNode.getAttribute('data-id') && (element = element.parentNode);
            var num = parseInt(element.getAttribute('data-id') || element.parentNode.getAttribute('data-id'));
            var nav_active = document.querySelector('.sideBar').querySelector('.res-panel-nav').querySelector('.active');
            $(nav_active).removeClass('active');
            $(element).addClass('active');

            var lib_current = document.querySelector('.sideBar').querySelector('.res-panel-lib').querySelector('.active');
            var lib_target = document.querySelector('.sideBar').querySelector('.res-panel-lib').children[num];
            $(lib_current).removeClass('active');
            $(lib_target).addClass('active');
        }
    });

    document.querySelector('.sideBar').querySelector('.res-panel-lib').addEventListener('click', function(e){
        var element = e.target || e.srcElement;
        if(element.getAttribute('data-type') == 'text' || 
            element.parentNode.getAttribute('data-type') == 'text' ||
            element.parentNode.parentNode.getAttribute('data-type') == 'text'){
            
            if(document.querySelector('.stage').querySelector('.checked')){
                document.querySelector('.stage').querySelector('.checked').querySelector('.cmp-operate').children[0].style.display = 'none';
                document.querySelector('.stage').querySelector('.checked').className = document.querySelector('.stage').querySelector('.checked').className.replace(/checked/g,'');
            }
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
            
            if(document.querySelector('.stage').querySelector('.checked')){
                document.querySelector('.stage').querySelector('.checked').querySelector('.cmp-operate').children[0].style.display = 'none';
                document.querySelector('.stage').querySelector('.checked').className = document.querySelector('.stage').querySelector('.checked').className.replace(/checked/g,'');
            }
            insertLine(document.querySelector('.stage').children[3]);
        }else if(element.getAttribute('data-type') == 'image-item' ||
                element.parentNode.getAttribute('data-type') == 'image-item'){
            
            var src = element.getAttribute('data-src') || element.parentNode.getAttribute('data-src');

            if(document.querySelector('.stage').querySelector('.checked')){
                document.querySelector('.stage').querySelector('.checked').querySelector('.cmp-operate').children[0].style.display = 'none';
                document.querySelector('.stage').querySelector('.checked').className = document.querySelector('.stage').querySelector('.checked').className.replace(/checked/g,'');
            }
            insertImage(document.querySelector('.stage').children[3], src);
        }
    });

    document.querySelector('.sideBar').querySelector('.res-panel-lib').querySelector('.breadNav').addEventListener('click', function(e){
        var element = e.target || e.srcElement;
        if(element.tagName == 'A'){
            document.querySelector('.sideBar').querySelector('.res-panel-nav').children[1].click();
        }
    });

    document.querySelector('.editor-header').addEventListener('click', function(e){
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

            var headerPosition = [0, parseFloat(blockHeader.style.height)];
            var bodyPosition = [parseFloat(headerPosition[1]), parseFloat(headerPosition[1])+parseFloat(blockBody.style.height)];
            var bottomPosition = [parseFloat(bodyPosition[1]), parseFloat(bodyPosition[1])+parseFloat(blockBottom.style.height)];
            
            var headerCmp = [{
                x: 0,
                y: headerPosition[1],
                width: blockHeader.style.width,
                height: blockHeader.style.height,
                line: [],
                img: [],
                text: []
            }];
            var bodyCmp = [{
                x: 0,
                y: bodyPosition[0],
                width: blockBody.style.width,
                height: blockBody.style.height,
                line: [],
                img: [],
                text: []
            }];
            var bottomCmp = [{
                x: 0,
                y: bottomPosition[0],
                width: blockBottom.style.width,
                height: blockBottom.style.height,
                line: [],
                img: [],
                text: []
            }];

            cmps.forEach(function(v){
                var top = parseFloat(v.style.top);
                if(top >= headerPosition[0] && top < headerPosition[1]){
                    if(v.getAttribute('data-type') == 'image'){
                        headerCmp[0].img.push(createJsonData(v));
                    }else if(v.getAttribute('data-type') == 'text'){
                        headerCmp[0].text.push(createJsonData(v));
                    }else if(v.getAttribute('data-type') == 'line'){
                        headerCmp[0].line.push(createJsonData(v));
                    }
                }else if(top >= bodyPosition[0] && top < bodyPosition[1]){
                    if(v.getAttribute('data-type') == 'image'){
                        bodyCmp[0].img.push(createJsonData(v));
                    }else if(v.getAttribute('data-type') == 'text'){
                        bodyCmp[0].text.push(createJsonData(v));
                    }else if(v.getAttribute('data-type') == 'line'){
                        bodyCmp[0].line.push(createJsonData(v));
                    }
                }else if(top >= bottomPosition[0] && top < bottomPosition[1]){
                    if(v.getAttribute('data-type') == 'image'){
                        bottomCmp[0].img.push(createJsonData(v));
                    }else if(v.getAttribute('data-type') == 'text'){
                        bottomCmp[0].text.push(createJsonData(v));
                    }else if(v.getAttribute('data-type') == 'line'){
                        bottomCmp[0].line.push(createJsonData(v));
                    }
                }
            })

            var bookdoc = [{
                width: stage.style.width,
                height: stage.style.height,
                bookheader: headerCmp,
                bookbody: bodyCmp,
                bookbottom: bottomCmp
            }];

            debugger

            /**
             * 取新模板编号
             */
            var obj = {
                succFunc: function(result){
                    if(result.success == '1'){
                        ds.modelId = result.modelId;
                    }else{
                        alert('取新模板编号失败！');
                    }
                },
                errFunc: function(result){
                    alert('取新模板编号失败！');
                }
            };
            // ds.blankModel(obj);

            /**
             * 保存模板
             */
            var obj = {
                succFunc: function(result){
                    if(result.success == '1'){
                        alert('保存模板成功！');
                    }else{
                        alert('保存模板失败！');
                    }
                },
                errFunc: function(result){
                    alert('保存模板失败！');
                }
            };
            // ds.saveModel(bookdoc, obj);



        }else if(element.getAttribute('data-btn') == 'preview'){
            /**
             * 查询简图
             */
            var obj = {
                succFunc: function(result){
                    debugger
                },
                errFunc: function(result){
                    alert('读取缩略图失败！');
                }
            };
            ds.modelId = 'M4';
            ds.queryPrivateModelIcon(obj);
        }else if(element.getAttribute('data-btn') == 'login'){
            //automatic login 
            ds.sysInit();
            var obj = {
                succFunc: function(result){
                    if(result.success == '1'){
                        alert('登陆成功！');
                        ds.accountNo = result.accountNo;
                    }else{
                        alert('登陆失败！');
                    }
                },
                errFunc: function(result){
                    alert('登陆失败！');
                }
            };
            ds.login(obj);
        }else if(element.getAttribute('data-btn') == 'readList'){
            var obj = {
                succFunc: function(result){
                    debugger
                },
                errFunc: function(result){
                    alert('获取模板列表失败！');
                }
            };
            ds.queryPrivateModelAll(obj);
        }else if(element.getAttribute('data-btn') == 'readSingle'){
            var obj = {
                succFunc: function(result){
                    var bookdoc = result.bookdoc[0];

                    var stage = document.querySelector('.stage');
                    var blockHeader = stage.querySelector('.block-header'); 
                    var blockBody = stage.querySelector('.block-body'); 
                    var blockBottom = stage.querySelector('.block-bottom'); 

                    blockHeader.style.height = bookdoc['bookheader'][0]['height'];
                    blockBody.style.height = bookdoc['bookbody'][0]['height'];
                    blockBottom.style.height = bookdoc['bookbottom'][0]['height'];
                    

                    var cmps = [];
                    var cmpTypes = ['logo', 'line', 'img', 'text', 'bookno'];
                    for(var i=0; i<cmpTypes.length; i++){
                        var arr = bookdoc['bookheader'][0][cmpTypes[i]];
                        if(arr){
                            arr.forEach(function(v){
                                v.cmpType = cmpTypes[i];
                            })
                            cmps = cmps.concat(arr);
                        }
                    }
                    for(var i=0; i<cmpTypes.length; i++){
                        var arr = bookdoc['bookbody'][0][cmpTypes[i]];
                        if(arr){
                            arr.forEach(function(v){
                                v.cmpType = cmpTypes[i];
                            })
                            cmps = cmps.concat(arr);
                        }
                    }
                    for(var i=0; i<cmpTypes.length; i++){
                        var arr = bookdoc['bookbottom'][0][cmpTypes[i]];
                        if(arr){
                            arr.forEach(function(v){
                                v.cmpType = cmpTypes[i];
                            })
                            cmps = cmps.concat(arr);
                        }
                    }
                    
                    var cmpsPanel = stage.children[3];
                    cmpsPanel.innerHTML = '';

                    cmps.forEach(function(v){
                        if(v.cmpType == 'text'){
                            insertText(cmpsPanel, v);
                        }else if(v.cmpType == 'img'){
                            insertImage(cmpsPanel, '', v);
                        }else if(v.cmpType == 'line'){
                            insertLine(cmpsPanel, v);
                        }
                    })
                },
                errFunc: function(result){
                    alert('读取模版信息失败');
                }
            };
            ds.modelId = 'M4';
            ds.readModel(obj);
        }else if(element.getAttribute('data-btn') == 'delete'){
            var obj = {
                succFunc: function(result){
                    debugger
                },
                errFunc: function(result){
                    alert('删除模板失败！');
                }
            };
            ds.modelId = '';
            ds.deleteModel(obj);
        }
    });

    document.querySelector('.positionPanel').addEventListener('change', function(e){
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
    });

    document.querySelector('.modal-menu').addEventListener('click', function(e){
        var element = e.target || e.srcElement;
        if(element.tagName.toLocaleLowerCase() == 'li'){
            if(element.getAttribute('data-btn') == 'delete'){
                document.querySelector('.stage').querySelector('.checked').remove();
            }
        }
        document.querySelector('.modal-menu').style.display = 'none';
    });

    /**
     * 取色器
     */
    var colorPickers = document.querySelectorAll('.colorSample');
    for(var i=0; i<colorPickers.length; i++){
        colorPickers[i].addEventListener('change', function(e){
            var element = this;
            element.nextElementSibling.value = element.value;
            if(element.getAttribute('data-type') == 'bgColor'){
                document.querySelector('.stage').querySelector('.checked').style.backgroundColor = element.value;
            }else if(element.getAttribute('data-type') == 'color'){
                document.querySelector('.stage').querySelector('.checked').style.color = element.value;
            }
        });
    }
    
    /**
     * 禁止右击事件
     */
    document.oncontextmenu = function(){
    　　return false;
    }
    /**
     * @param {element} element 
     */
    function createJsonData(element){
        var data;
        if(element.getAttribute("data-type") == 'logo'){
        }else if(element.getAttribute("data-type") == 'line'){
            data = {
                x: parseFloat(element.style.left),
                y: parseFloat(element.style.top),
                width: element.style.width,
                height: element.querySelector('.cmpScaleArea').children[0].style.height,
                color: _colorHelper.colorHex(element.querySelector('.cmpScaleArea').children[0].style.backgroundColor),
            };
        }else if(element.getAttribute("data-type") == 'image'){
            data = {
                x: parseFloat(element.style.left),
                y: parseFloat(element.style.top),
                width: element.style.width,
                height: element.style.height,
                src: element.querySelector('.cmpScaleArea').children[0].src,
            };
        }else if(element.getAttribute("data-type") == 'text'){
            data = {
                x: parseFloat(element.style.left),
                y: parseFloat(element.style.top),
                width: element.style.width,
                height: window.getComputedStyle(element).height,
                font_family: element.style.fontFamily,
                font_size: element.style.fontSize,
                font_weight: element.style.fontWeight,
                font_color: _colorHelper.colorHex(element.style.color),
                bgcolor: _colorHelper.colorHex(element.style.backgroundColor),
                comment: element.querySelector('.cmpMain').innerText,
            };
        }else if(element.getAttribute("data-type") == 'bookno'){
        }
        return data;
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
        var cmpDrawWrapper = element;
        var oldX = e.clientX,
            oldY = e.clientY;
        var oBoxW = parseFloat(cmpDrawWrapper.style.width),
            oBoxH = parseFloat(cmpDrawWrapper.style.height),
            oBoxL = parseFloat(cmpDrawWrapper.style.left),
            oBoxT = parseFloat(cmpDrawWrapper.style.top);
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
    function insertText(container, data){
        var left = (parseInt(container.parentNode.style.width) / 2 - 50) + 'px';
        var top = parseInt(container.parentNode.style.height) / 2 + 'px';
        var width = '100px';
        var height = '20px';
        var color = '#ff0000';
        var backgroundColor = '#ffffff';
        var fontFamily = 'SimSun';
        var fontSize = '14px';
        var fontWeight = '200';
        var text = '请输入文字';
        if(data){
            left = data.x + 'px';
            top = data.y + 'px';
            width = data.width;
            height = data.height;
            color = data.font_color;
            backgroundColor = data.bgcolor;
            fontFamily = data.font_family;
            fontSize = data.font_size;
            fontWeight = data.font_weight;
            text = data.comment;
        }

        var textHtml = '<div class="cmp-wrapper checked" data-type="text" data-editable="false"\
                         style="left:'+left+';\
                                top:'+top+';\
                                width:'+width+';\
                                height:'+height+';\
                                color:'+color+';\
                                background-color:'+backgroundColor+';\
                                font-family:'+fontFamily+';\
                                font-size:"'+fontSize+'"\
                                font-weight:'+fontWeight+';">\
                            <div class="cmp-render" style="width:100%;position:relative;z-index:9;">\
                                <div class="cmpScaleArea" style="height:auto;">\
                                    <div data-type="text" class="cmpMain" style="word-break:break-all;z-index:9999;">'+text+'</div>\
                                </div>\
                            </div>\
                            <div class="cmp-operate" style="width:100%;height:100%;">\
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
    function insertImage(container, src, data){
        var left = (parseInt(container.parentNode.style.width) / 2 - 100) + 'px';
        var top = parseInt(container.parentNode.style.height) / 2 + 'px';

        var width = '250px';
        var height = '150px';
        if(data){
            left = data.x + 'px';
            top = data.y + 'px';
            width = data.width;
            height = data.height;
            src = data.src;
        }

        var textHtml = '<div class="cmp-wrapper checked" data-type="image" data-editable="false"\
                            style="left:'+left+';\
                                    top:'+top+';\
                                    width:'+width+';\
                                    height:'+height+';">\
                            <div class="cmp-render" style="width:100%;height:100%;">\
                                <div class="cmpScaleArea">\
                                    <img class="cmpMain" style="width:100%;height:100%;" src="'+src+'"/>\
                                </div>\
                            </div>\
                            <div class="cmp-operate" data-type="logo" style="width:100%;height:100%;">\
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
    function insertLine(container, data){
        var left = (parseInt(container.parentNode.style.width) / 2 - 50) + 'px';
        var top = parseInt(container.parentNode.style.height) / 2 + 'px';

        var width = '100px';
        var height = '2px';
        var color = '#333';
        if(data){
            left = data.x + 'px';
            top = data.y + 'px';
            width = data.width;
            height = data.height;
            color = data.color;
        }

        var textHtml = '<div class="cmp-wrapper checked" data-type="line" data-editable="false"\
                            style="left:'+left+';\
                                    top:'+top+';\
                                    width:'+width+';\
                                    height:10px;">\
                            <div class="cmp-render" style="width:100%;height:100%;">\
                                <div class="cmpScaleArea">\
                                    <div style="background-color:'+color+';width:100%;height:'+height+';position:absolute;top:50%;transform:translateY(-50%);" class="cmpMain"></div>\
                                </div>\
                            </div>\
                            <div class="cmp-operate" style="width:100%;height:100%;">\
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

                if(type == 'block'){
                    var header = stage.querySelector('.block-header');
                    var body = stage.querySelector('.block-body');
                    var bottom = stage.querySelector('.block-bottom');
                    
                    stage.querySelector('.block-active').className = document.querySelector('.stage').querySelector('.block-active').className.replace('block-active', '');
                    if(input.value == '头部编辑'){
                        header.className += ' block-active';
                        updateDetailBar(header, 'block');
                    }else if(input.value == '正文编辑'){
                        body.className += ' block-active';
                        updateDetailBar(body, 'block');
                    }else if(input.value == '尾部编辑'){
                        bottom.className += ' block-active';
                        updateDetailBar(bottom, 'block');
                    }
                }else if(type == 'font'){
                    var cmp = stage.querySelector('.checked');
                    cmp.style.fontFamily = fontMap_2[input.value] || input.value;
                }else if(type == 'size'){
                    var cmp = stage.querySelector('.checked');
                    cmp.style.fontSize = parseInt(input.value) + 'px';
                }else if(type == 'weight'){
                    var cmp = stage.querySelector('.checked');
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
        bgColorPanel.children[0].value = '#ffffff';
        bgColorPanel.children[1].value = '';
        fontColorPanel.children[0].value = '#ffffff';
        fontColorPanel.children[1].value = '';
        fontPanel.querySelector('input').value = '';
        sizePanel.querySelector('input').value = '';
        thickPanel.querySelector('input').value = '';
        
        positionX.children[1].value = '';
        positionY.children[1].value = '';
        sizeW.children[1].value = '';
        sizeH.children[1].value = '';

        if(element.getAttribute('data-type') == 'text'){
            detailBar.children[0].children[1].style.display = 'block';
        }else{
            detailBar.children[0].children[1].style.display = 'none';
        }

        if(type == 'block'){
            sizeW.children[1].value = parseInt(element.style.width || window.getComputedStyle(element).width);
            sizeH.children[1].value = parseInt(element.style.height || window.getComputedStyle(element).height) ;
        }else if(type == 'clear'){
        }else{
            sizeH.querySelector('input').removeAttribute('readonly');
            
            if(element.getAttribute('data-type') == 'text'){
                bgColorPanel.children[0].value = _colorHelper.colorHex(element.style.backgroundColor) || '#fff';
                bgColorPanel.children[1].value = _colorHelper.colorHex(element.style.backgroundColor) || '#fff';
                fontColorPanel.children[0].value = _colorHelper.colorHex(element.style.color)  || '#fff';
                fontColorPanel.children[1].value = _colorHelper.colorHex(element.style.color)  || '#fff';
                fontPanel.querySelector('input').value = fontMap_1[element.style.fontFamily] || element.style.fontFamily;
                sizePanel.querySelector('input').value = parseInt(element.style.fontSize);
                thickPanel.querySelector('input').value = parseInt(element.style.fontWeight);

                sizeH.querySelector('input').setAttribute('readonly', 'readonly');
            }

            positionX.children[1].value = parseInt(element.style.left);
            positionY.children[1].value = parseInt(element.style.top);
            sizeW.children[1].value = parseInt(element.style.width);
            sizeH.children[1].value = parseInt(window.getComputedStyle(element).height);
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
        
        var stageHeight = parseFloat(stage.style.height);
        var headerHeight = parseFloat(header.style.height);
        var bodyHeight = parseFloat(body.style.height);
        var bottomHeight = parseFloat(bottom.style.height);
        
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