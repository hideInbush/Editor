var dataStream = function(){
    var tid = Math.random().toString(8).substr(2,4);
    return {
        saveTemplate: function(){

        },

        blankModel:function(obj){
            var data ={
                modelService:'blankModel',
                accountNo:richMediaRequest.accountNo,
                tid:richMediaRequest.tid
            }
            var successFunc =  function (e) {
                obj.successFunc();
            };
            var errorFunc = function () {}
            doAjax(data,successFunc,errorFunc,true);
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
        saveModel:function(obj){
            var data ={
                modelService:'save',
                accountNo:richMediaRequest.accountNo,
                tid:richMediaRequest.tid,
                modelId:obj.modelId,
                bookdoc:obj.bookdoc
            }
            var successFunc =  function (e) {};
            var errorFunc = function () {}
            doAjax(data,successFunc,errorFunc,true);
        },
        readModel:function(obj){
            var data ={
                modelService:'readModel',
                accountNo:richMediaRequest.accountNo,
                tid:richMediaRequest.tid,
                modelId:obj.modelId
            }
            var successFunc =  function (e) {};
            var errorFunc = function () {}
            doAjax(data,successFunc,errorFunc,true);
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
            var data ={
                modelService:'delete',
                accountNo:richMediaRequest.accountNo,
                tid:richMediaRequest.tid,
                modelId:obj.modelId
            }
            var successFunc =  function (e) {};
            var errorFunc = function () {}
            doAjax(data,successFunc,errorFunc,true);
        }
    }
};
