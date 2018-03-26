
var richMediaRequest = function(){ 
    return {
        tid : rndNoAndTim.RndNum(5),
        accountNo:'',
        //基本用户信息管理
        user:{
            sysInit:function(successFunc){
                var data = {
                    service:'sysinit',
                    tid:richMediaRequest.tid
                },

                erroFunc = function(){

                };
                doAjax(data,successFunc,erroFunc,false);
            },
            resetTid:function(){
                var data ={
                    service:'reset',
                    accountNo:richMediaRequest.accountNo,
                    tid: rndNoAndTim.RndNum(5)
                };
                var successFunc =  function (data,success,error,async) {
                    doAjax(data,success,error,async);
                };
                var errorFunc = function () {};
                doAjax(data,successFunc,errorFunc,true);
            },
            register: function(obj){ 
                var data ={
                    userService:'register',
                    account:obj.account,
                    password:sha1(obj.password),
                    tid:richMediaRequest.tid
                },
                successFunc =  function (e) {
                },
                errorFunc = function () {
                };
                doAjax(data,successFunc,errorFunc,false);
            },
            login:function(obj){
                var data ={
                    userService:'login',
                    account:obj.account,
                    password:sha1(obj.password),
                    tid:richMediaRequest.tid
                };
                doAjax(data,obj.succFunc, obj.erroFunc,true);
            },
            logout:function(){
                var data ={
                    userService:'logout',
                    accountNo:richMediaRequest.accountNo,
                    tid:richMediaRequest.tid
                };
                var successFunc =  function (e) {};
                var errorFunc = function () { };
                doAjax(data,successFunc,errorFunc,true);
            },
            registerAccountVerify:function(obj){
                var data ={
                    userService:'check',
                    accountNo:obj.accountNo,
                    tid:richMediaRequest.tid
                };
                var errorFunc = function () {
                    
                };
                doAjax(data,obj.succFunc,errorFunc,true);
            },
            updatePsw:function(obj){
                var data ={
                    userService:'password',
                    accountNo:richMediaRequest.accountNo,
                    tid:richMediaRequest.tid,
                    oldPass:sha1(obj.oldPass),
                    newPass:sha1(obj.newPass)
                };
                var successFunc =  function (e) {};
                var errorFunc = function () {};
                doAjax(data,successFunc,errorFunc,true);
            },
            addUserDetail:function(obj){
                var data ={
                    userService:'addDetail',
                    accountNo:obj.accountNo,
                    name:obj.name,
                    alias:obj.alias,
                    gender:obj.gender,
                    unit:obj.unit,
                    department:obj.department,
                    class:obj.class,
                    dateofattendee:obj.dateofattendee,
                    email:obj.email,
                    qq:obj.qq,
                    weixin:obj.weixin,
                    phone:obj.phone,
                    education:obj.education,
                    degree:obj.degree,
                    major:obj.major,
                    minor:obj.minor,
                    tid:richMediaRequest.tid
                };
                var successFunc =  function (e) {};
                var errorFunc = function () { };
                doAjax(data,successFunc,errorFunc,true);
            },
            queryUserDetail:function(obj){
                obj.tid = richMediaRequest.tid;
                obj.userService = 'queryDetail';
                var data = obj;
                doAjax(data,obj.succFunc,obj.erroFunc,false);
            },
            updateUserDetail:function(obj){
                obj.tid = richMediaRequest.tid;
                obj.userService = 'updateDetail';
                obj.accountNo =richMediaRequest.accountNo;
                var data =obj;
                var successFunc =  function (e) {};
                var errorFunc = function () {};
                doAjax(data,successFunc,errorFunc,true);
            },
            //权限管理
            queryUserAuth:function(obj){
                var data ={
                    authService:'queryAuth',
                    accountNo:richMediaRequest.accountNo,
                    tid:richMediaRequest.tid
                }
                var errorFunc = function () {};
                doAjax(data,obj.succFunc,errorFunc,false);
            },
            setUserAuth:function(obj){
                var data ={
                    authService:'setAuth',
                    accountNo:richMediaRequest.accountNo,
                    acceptShareModel:obj.acceptShareModel,
                    acceptShareEbook:obj.acceptShareEbook,
                    sendShareModel:obj.sendShareModel,
                    sendShareEbook:obj.sendShareEbook,
                    allowTeamEbookRead:obj.allowTeamEbookRead,
                    allowGroupEbookRead:obj.allowGroupEbookRead,
                    tid:richMediaRequest.tid
                };
                var errorFunc = function () { };
                doAjax(data,obj.successFunc,errorFunc,true);
            }
        },
        //团队、组
        groupTeam:{
            groupCreate:function (obj) {
                obj.accountNo = richMediaRequest.accountNo;
                obj.tid = richMediaRequest.tid;
                obj.groupService = 'groupCreate';
                var data =obj;
                var errorFunc = function () {};
                doAjax(data,obj.successFunc,errorFunc,true);
            },
            groupQueryAll:function(obj){
                var data ={
                    groupService:'groupQueryAll',
                    accountNo:richMediaRequest.accountNo,
                    tid:richMediaRequest.tid
                };
                var successFunc =  function (e) {
                    obj.successFunc(e.groupId);
                };
                var errorFunc = function () {};
                doAjax(data,successFunc,errorFunc,true);
            },
            queryGroupInfo:function(obj){
                var data ={
                    groupService:'groupQuery',
                    accountNo:richMediaRequest.accountNo,
                    groupId:obj.groupId,
                    tid:richMediaRequest.tid
                };
                var errorFunc = function () {};
                doAjax(data,obj.successFunc,errorFunc,false);
            },
            groupUpdate:function(obj){
                var data ={
                    groupService:'groupUpdate',
                    accountNo:richMediaRequest.accountNo,
                    groupId:obj.groupId,
                    groupName:obj.groupName,
                    groupNameComment:obj.groupNameComment,
                    tid:richMediaRequest.tid
                };
                doAjax(data,obj.successFunc,obj.erroFunc,true);
            },
            groupDelete:function(obj){
                var data ={
                    groupService:'groupDelete',
                    accountNo:richMediaRequest.accountNo,
                    groupId:obj.groupId,
                    tid:richMediaRequest.tid
                };
                doAjax(data,obj.successFunc,obj.errorFunc,true);
            },
            //组
            teamCreate:function(obj){
                var data ={
                    teamService:'teamCreate',
                    accountNo:richMediaRequest.accountNo,
                    groupId:obj.groupId,
                    teamName:obj.teamName,
                    teamNameComment:obj.teamNameComment,
                    tid:richMediaRequest.tid
                };
                doAjax(data,obj.successFunc,obj.errorFunc,true);
            },
            teamQueryAll:function(obj){
                var data ={
                    teamService:'teamQueryAll',
                    accountNo:richMediaRequest.accountNo,
                    groupId:obj.groupId,
                    tid:richMediaRequest.tid
                };
                var successFunc =  function (e) {obj.successFunc(e)};
                var errorFunc = function () {};
                doAjax(data,successFunc,errorFunc,true);
            },
            queryTeamInfo:function(obj){
                var data ={
                    teamService:'teamQuery',
                    accountNo:richMediaRequest.accountNo,
                    groupId:obj.groupId,
                    teamId:obj.teamId,
                    tid:richMediaRequest.tid
                };
                var successFunc =  function (e) {obj.successFunc(e)};
                var errorFunc = function () {};
                doAjax(data,successFunc,errorFunc,false);
            },
            teamUpdate:function(obj){
                var data ={
                    teamService:'teamUpdate',
                    accountNo:richMediaRequest.accountNo,
                    groupId:obj.groupId,
                    teamId:obj.teamId,
                    teamName:obj.teamName,
                    teamNameComment:obj.teamNameComment,
                    tid:richMediaRequest.tid
                };
                doAjax(data,obj.successFunc,obj.errorFunc,true);
            },
            teamDelete:function(obj){
                var data ={
                    teamService:'teamDelete',
                    accountNo:richMediaRequest.accountNo,
                    groupId:obj.groupId,
                    teamId:obj.teamId,
                    tid:richMediaRequest.tid
                };
                doAjax(data,obj.successFunc,obj.errorFunc,true);
            },
        },
        //模板model
        model:{
            queryPublicModelAll:function(obj){
                var data ={
                    modelService:'queryPublicModelAll',
                    accountNo:richMediaRequest.accountNo,
                    tid:richMediaRequest.tid
                }
                var successFunc =  function (e) {
                    obj.successFunc();
                };
                var errorFunc = function () {
                    obj.erroFunc();
                }
                doAjax(data,successFunc,errorFunc,true);
            },
            queryPublicModel:function(obj){
                var data ={
                    modelService:'queryPublicModel',
                    accountNo:richMediaRequest.accountNo,
                    modelId:obj.modelId,
                    tid:richMediaRequest.tid
                }
                var successFunc =  function (e) {
                    obj.successFunc();
                };
                var errorFunc = function () {}
                var async;
                if(obj.async != undefined){
                    async = obj.async
                }else{
                    async = true;
                }
                doAjax(data,successFunc,errorFunc,async);
            },
            queryPublicModelIcon:function(obj){
                var data ={
                    modelService:'queryPublicModelIcon',
                    accountNo:obj.accountNo,
                    modelId:obj.modelId,
                    tid:richMediaRequest.tid
                }
                var successFunc =  function (e) {};
                var errorFunc = function () {}
                var async;
                if(obj.async != undefined){
                    async = obj.async
                }else{
                    async = true;
                }
                doAjax(data,successFunc,errorFunc,async);
            },
            queryPublicModelImg:function(obj){
                var data ={
                    modelService:'queryPublicModelImg',
                    accountNo:obj.accountNo,
                    modelId:obj.modelId,
                    tid:richMediaRequest.tid
                }
                var successFunc =  function (e) {};
                var errorFunc = function () {}
                doAjax(data,successFunc,errorFunc,true);
            },
            copyPublicModel:function(obj){
                var data ={
                    modelService:'copyPublicModel',
                    accountNo:richMediaRequest.accountNo,
                    modelId:obj.modelId,
                    tid:richMediaRequest.tid
                }
                var successFunc =  function (e) {};
                var errorFunc = function () {}
                doAjax(data,successFunc,errorFunc,true);
            },
            queryPrivateModelAll:function(obj){
                var data ={
                    modelService:'queryPrivateModelAll',
                    accountNo:richMediaRequest.accountNo,
                    tid:richMediaRequest.tid
                }
                var successFunc =  obj.successFunc;
                var errorFunc = obj.erroFunc;
                doAjax(data,successFunc,errorFunc,true);
            },
            queryPrivateModel:function(obj){
                var data ={
                    modelService:'queryPrivateModel',
                    accountNo:obj.accountNo,
                    modelId:obj.modelId,
                    tid:richMediaRequest.tid
                }
                var successFunc =  function (e) {};
                var errorFunc = function () {}
                var async;
                if(obj.async != undefined){
                    async = obj.async
                }else{
                    async = true;
                }
                doAjax(data,successFunc,errorFunc,async);
            },
            queryPrivateModelIcon:function(obj){
                var data ={
                    modelService:'queryPrivateModelIcon',
                    accountNo:obj.accountNo,
                    modelId:obj.modelId,
                    tid:richMediaRequest.tid
                }
                var successFunc =  function (e) {};
                var errorFunc = function () {}
                var async;
                if(obj.async != undefined){
                    async = obj.async
                }else{
                    async = true;
                }
                doAjax(data,successFunc,errorFunc,async);
            },
            queryPrivateModelImg:function(obj){
                var data ={
                    modelService:'queryPrivateModelImg',
                    accountNo:obj.accountNo,
                    modelId:obj.modelId,
                    tid:richMediaRequest.tid
                }
                var successFunc =  function (e) {};
                var errorFunc = function () {}
                doAjax(data,successFunc,errorFunc,true);
            },
            sharePrivateModel:function(obj){
                var data ={
                    modelService:'sharePrivateModel',
                    accountNo1:obj.accountNo1,
                    accountNo2:obj.accountNo2,
                    modelId:obj.modelId,
                    tid:richMediaRequest.tid
                }
                var successFunc =  function (e) {};
                var errorFunc = function () {}
                doAjax(data,successFunc,errorFunc,true);
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
    } 
    }()
//ajax数据请求方法
var doAjax = function(data,success,error,async) {
        $.ajax({
            type: "POST",
            url:"/ebook",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "text",
            async: async,
            success: function(e){
                var dataResult = JSON.parse(e);
                if(dataResult.reason == 'resetid'){
                    richMediaRequest.user.resetTid(data,success,error,async);
                    return;
                }
                if(dataResult.reason == "rlogn"||dataResult.reason == "timeout"){
                    richMediaRequest.user.sysInit();
                    alert("请重新登录");
                    return;
                }
                if(dataResult.reason == "syserro"){
                    alert("数据传输错误");
                    return;
                }     
                richMediaRequest.tid = dataResult.tid;
                if(success){
                    success(dataResult);
                };
            },
            error:error
        })
    
   
}
