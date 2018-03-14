/**
 * Created by bao on 2018/1/22.
 */
define([
    'backbone',
    'common'
], function(Backbone,common) {
    var AppModel = Backbone.Model.extend({
        initialize: function(){
            this.bind("invalid", function(model, error){
                if(error){
                    console.log(error);
                }
            });
        },
        defaults:{
            h1:"业务组",
            h2:"规则",
            //表格搜索条件
            search1:[{
                span:"业务组：",
                type:"text",
                data:"busName"
            },{
                span:"创建时间：",
                type:"time",
                data:"startTime",
                childNode:{
                    span:"至",
                    type:"time",
                    data:"endTime"
                }
            }],
            table_columns1:[{
                data:"id",
                title:'<input type="checkbox" class="group-checkable" data-set="#business_1 .checkboxes"/>',
                orderable:false,
                render: function(data, type, full) {
                    return '<input type="checkbox" class="checkboxes" data-id="'+data+'"/>';
                }
            },{
                data:"busName",
                title:'业务组'
            },{
                data:null,
                title:'IP白名单',
                orderable:false,
                render: function ( data, type, full, meta ){
                    return '暂未开启IP白名单服务';
                }
            },{
                data:null,
                title:'IP黑名单',
                orderable:false,
                render: function ( data, type, full, meta ){
                    return '暂未开启IP黑名单服务';
                }
            },{
                data:"createTime",
                title:'创建时间'
            },{
                data:null,
                title:'配置规则管理',
                render: function ( data, type, full, meta ){
                    return '<a data-id='+full['id']+' data-name='+full['busName']+' class="btn default btn-xs green business-rule"><i class="fa fa-search"></i> 查看 </a>';
                }
            },{
                data:"appKey",
                title:'appkey相关文件',
                orderable:false,
                render: function ( data, type, full, meta ) {
                    var cls = '';
                    if(full['ifFile'] == 0){
                        cls = 'default';
                    }else {
                        cls = 'green';
                    }
                    if(full['count']==0){
                        return "<span class= 'label label-sm label-danger'>未配置规则</span>"
                    }else{
                        return '<a data-id='+full['id']+' class="btn btn-xs '+cls+' appLoad"><i class="fa fa-file"></i> 下载 </a>';
                    }
                }
            },{
                data:"sdk",
                title:'SDK相关文件',
                orderable:false,
                render: function ( data, type, full, meta ) {
                    if(full['count']==0){
                        return "<span class= 'label label-sm label-danger'>未配置规则</span>"
                    }else{
                        return '<a data-id='+full['id']+' class="btn btn-xs green sdkLoad"><i class="fa fa-file"></i> 下载 </a>';
                    }
                }
            }],
            search2:[{
                span:"IP：",
                type:"text",
                data:"ip"
            },{
                span:"创建时间：",
                type:"time",
                data:"startTime",
                childNode:{
                    span:"至",
                    type:"time",
                    data:"endTime"
                }
            }],
            table_columns2:[{
                data:"ruleId",
                title:'<input type="checkbox" class="group-checkable" data-set="#business_2 .checkboxes"/>',
                orderable:false,
                render: function(data, type, full) {
                    return '<input type="checkbox" class="checkboxes" data-id="'+data+'"/>';
                }
            },{
                data:"sourceIp",
                title:'源站IP'
            },{
                data:"sourcePort",
                title:'源站端口'
            },{
                data:"protocal",
                title:'转发协议',
                render: function ( data, type, full, meta ){
                    switch (data){
                        case 1:
                            return 'TCP/UDP';
                            break;
                        case 2:
                            return 'HTTP';
                            break;
                        default:
                            return '';
                            break;
                    }
                }
            },{
                data:"busRule",
                title:'转发规则',
                render: function ( data, type, full, meta ){
                    switch (data) {
                        case 1:
                            return '轮询';
                            break;
                        default:
                            return '';
                            break;
                    }
                }
            },{
                data:"createTime",
                title:'创建时间'
            },{
                data:"ip",
                title:'清洗IP',
                render: function ( data, type, full, meta ){
                    var arr = encodeURI(JSON.stringify(full["rinseJson"]));
                    return '<a href="javascript:void(0);" style="cursor: pointer" class="ip-detail" data-arr="'+arr+'">'+full["rinseJson"].length+'</a>';
                }
            }]
        },
        validate: function(attributes){
            common.jsonErgo(attributes);
        }
    });
    //工厂构造，每次调用直接初始化一个model对象
    //var o = new AppModel();
    //return o;
    return new AppModel();
});