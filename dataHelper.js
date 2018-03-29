var dataStream = function(){
    return {
        tid: Math.random().toString(8).substr(2,5),
        accountNo: '',
        modelId: '',
        sysInit: function(){
            var data = {
                service: 'sysinit',
                tid: this.tid
            };
            var succFunc = function(){
            };
            var errFunc = function(){
            };
            doAjax(data, succFunc, errFunc, false);
        },
        login: function(obj){
            var data ={
                userService: 'login',
                account: 'ccj',
                password: sha1('ccj12345'),
                tid: this.tid
            };
            doAjax(data, obj.succFunc, obj.errFunc, true);
        },

        blankModel:function(obj){
            var data ={
                modelService: 'blankModel',
                accountNo: this.accountNo,
                tid: this.tid
            }
            doAjax(data, obj.succFunc, obj.errFunc, false);
        },

        initializeModel:function(obj){
            var data ={
                modelService:'initialize',
                modelId:obj.modelId,
                caseModelId:obj.caseModelId,
                accountNo:richMediaRequest.accountNo,
                tid:richMediaRequest.tid
            }
            var successFunc =  function (e) {
                obj.successFunc();
            };
            var errorFunc = function () {}
            doAjax(data,successFunc,errorFunc,true);
        },

        saveModel:function(bookdoc, obj){
            var data ={
                modelService: 'save',
                accountNo: this.accountNo,
                tid: this.tid,
                modelId: this.modelId,
                bookdoc: bookdoc
            }
            doAjax(data, obj.succFunc, obj.errFunc, true);
        },

        readModel:function(obj){
            var data = {
                modelService: 'readModel',
                accountNo: this.accountNo,
                tid: this.tid,
                modelId: this.modelId
            }
            doAjax(data, obj.succFunc, obj.errFunc, true);
        },
        updateModel:function(obj){
            var data ={
                modelService:'update',
                accountNo:richMediaRequest.accountNo,
                tid:richMediaRequest.tid,
                modelId:obj.modelId
            }
            var successFunc =  function (e) {};
            var errorFunc = function () {}
            doAjax(data,successFunc,errorFunc,true);
        },
        deleteModel:function(obj){
            var data = {
                modelService: 'delete',
                accountNo: this.accountNo,
                tid: this.tid,
                modelId: this.modelId
            }
            doAjax(data, obj.succFunc, obj.errFunc, true);
        },

        /**
         * 模板缩略图
         */
        queryPrivateModelIcon: function(obj){
            var data ={
                modelService: 'queryPrivateModelIcon',
                accountNo: this.accountNo,
                modelId: this.modelId,
                tid: this.tid,
                iconSize: 'X',
            }
            doAjax(data, obj.succFunc, obj.errFunc, true);
        },
        /**
         * 模板大图
         */
        queryPrivateModelImg:function(obj){
            var data ={
                modelService: 'queryPrivateModelImg',
                accountNo: this.accountNo,
                modelId: this.modelId,
                tid: this.tid
            }
            doAjax(data, obj.succFunc, obj.errFunc, true);
        },
        /**
         * 所有模板列表
         */
        queryPrivateModelAll:function(obj){
            var data ={
                modelService: 'queryPrivateModelAll',
                accountNo: this.accountNo,
                tid: this.tid
            }
            doAjax(data, obj.succFunc, obj.errFunc, true);
        },

    }
};

var ds = dataStream();
//ajax数据请求方法
var doAjax = function(data,success,error,async) {
    $.ajax({
        type: 'POST',
        // url: './proxy.php',
        url: '/ebook',
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'text',
        async: async,
        success: function(e){
            var dataResult = JSON.parse(e);
            // if(dataResult.reason == 'resetid'){
            //     richMediaRequest.user.resetTid(data,success,error,async);
            //     return;
            // }
            // if(dataResult.reason == "rlogn"||dataResult.reason == "timeout"){
            //     richMediaRequest.user.sysInit();
            //     alert("请重新登录");
            //     return;
            // }
            // if(dataResult.reason == "syserro"){
            //     alert("数据传输错误");
            //     return;
            // }     
            ds.tid = dataResult.tid;
            if(success){
                success(dataResult);
            };
        },
        error:error
    })


}
