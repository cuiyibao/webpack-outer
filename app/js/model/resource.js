/**
 * Created by bao on 2018/1/22.
 */
define([
    'backbone'
], function(Backbone) {
    var AppModel = Backbone.Model.extend({
        initialize: function(){
            this.bind("invalid", function(model, error){
                if(error){
                    console.log(error);
                }
            });
        },
        defaults:{
            h1:"资源配置",
            h1_1:"已选配置",
            h2:"资源配置信息",
            h3:"升级信息",
            page1:"hide",
            page2:"show",
            page3:"hide",
            form_static:[{
                label:'防护IP数量',
                cls:'static-count',
                text:'0'
            },{
                label:'业务带宽',
                cls:'static-bandwidth',
                text:'100M'
            },{
                label:'保底防护峰值',
                cls:'static-endPeak',
                text:'100G'
            },{
                label:'弹性防护峰值',
                cls:'static-elasticPeak',
                text:'100G'
            },{
                label:'购买时长',
                cls:'static-times',
                text:'1个月'
            },{
                label:'总价',
                cls:'static-total text-danger',
                text:'￥500'
            }],
            table_columns1:[
            //     {
            //     data:"id",
            //     title:'<input type="checkbox" class="group-checkable" data-set="#resource_1 .checkboxes"/>',
            //     orderable:false,
            //     render: function(data, type, full) {
            //         return '<input type="checkbox" class="checkboxes" data-id="'+data+'"/>';
            //     }
            // },
            {
                data:"protectNum",
                title:'防护IP'
            },{
                data:"terName",
                title:'地域',
                render: function ( data, type, full, meta ) {
                    var region = ['东北','华北','华东','华南','华中','西北','西南','其它'];
                    return region[data]
                }
            },{
                data:"ciruitTypes",
                title:'线路类型（运营商）',
                render: function ( data, type, full, meta ) {
                    var operator = ['移动','联通','电信','铁通','教育','其它'];
                    return operator[data]
                }
            },{
                data:"bandWidth",
                title:'业务带宽(Mbps)'
            },{
                data:"guaranteedPeek",
                title:'保底防护峰值(Gbps)'
            },{
                data:"elasticPeak",
                title:'弹性防护峰值(Gbps)'
            },{
                data:"purchaseTime",
                title:'购买时长(月)'
            },{
                data:"createTime",
                title:'创建时间'
            },{
                data:"expireDate",
                title:'到期时间'
            },{
                data:"state",
                title:'状态',
                render: function ( data, type, full, meta ) {
                    if(data == '1'){
                        return '<span class="btn btn-xs red">已使用</span>';
                    }else {
                        return '<span class="btn btn-xs default">未使用</span>';
                    }
                }
            },{
                data:null,
                title:'操作',
                orderable:false,
                render: function ( data, type, full, meta ) {
                    var cls = '';
                    if(full['protectNum']){
                        cls = 'green';
                    }else {
                        cls = 'default';
                    }
                    return '<a data-id='+full['id']+' data-state='+full['state']+' class="btn btn-xs  resource-up '+cls+'"><i class="fa fa-level-up"></i> 升级 </a>';
                }
            }]
        }
    });
    //工厂构造，每次调用直接初始化一个model对象
    //var o = new AppModel();
    //return o;
    return new AppModel();
});