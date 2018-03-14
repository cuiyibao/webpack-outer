/**
 * Created by bao on 2018/1/22.
 */
define([
    'backbone',
    'common',
    'tpl/resource.html',
    'model/resource',
    'datatimepicker',
    'toastr',
    'ion_rangeSlider',
    'jNum'
], function(Backbone, common, text, tpl, model, datatimepicker, toastr) {
    var View = Backbone.View.extend({
        el: '#page-content',
        template:_.template(tpl),
        initialize: function(router) {
            this.$el.html(this.template(model.toJSON()));
            //实例
            this.range1 = [];
            this.range2 = [];
            this.router = router;
            this.render();
            this.handle();

            //地域名
            this.region = {'东北':0,'华北':1,'华东':2,'华南':3,'华中':4,'西北':5,'西南':6,'其它':7};
            //运营商
            this.operator = {'移动':0,'联通':1,'电信':2,'铁通':3,'教育':4,'其它':5};
            if(document.all){ // document.createStyleSheet(url)
                window.style=".time-buy>.btn-default:hover{background-color: rgb(255, 255, 255)!important;}";
                document.createStyleSheet("javascript:style");
            }else{ //document.createElement(style)
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML=".time-buy>.btn-default:hover{background-color: rgb(255, 255, 255)!important;}";
                document.getElementsByTagName('HEAD').item(0).appendChild(style);
            }
        },
        render: function() {
            var view = this;
            this.range1.push($("#range1_1").ionRangeSlider({
                type: "single",
                min: 100,
                max: 1000,
                step: 100,
                grid: true,
                from: 0,
                grid_snap: true,
                postfix: "Mbps",
                onChange:function () {
                    view.calculate('add');
                }
            }));
            this.range1.push($("#range1_2").ionRangeSlider({
                type: "single",
                min: 100,
                max: 1000,
                step: 100,
                grid: true,
                from: 0,
                grid_snap: true,
                postfix: "Gbps",
                onChange:function () {
                    view.calculate('add');
                }
            }));
            this.range1.push($("#range1_3").ionRangeSlider({
                type: "single",
                min: 0,
                max: 1000,
                step: 100,
                grid: true,
                from: 0,
                grid_snap: true,
                postfix: "Gbps",
                onChange:function () {
                    view.calculate('add');
                }
            }));
            this.range2.push($("#range2_1").ionRangeSlider({
                type: "single",
                min: 100,
                max: 1000,
                step: 100,
                grid: true,
                from: 300,
                from_min:300,
                grid_snap: true,
                postfix: "Mbps",
                onChange:function () {
                    view.calculate('up');
                }
            }));
            this.range2.push($("#range2_2").ionRangeSlider({
                type: "single",
                min: 100,
                max: 1000,
                step: 100,
                grid: true,
                from: 200,
                from_min:200,
                grid_snap: true,
                postfix: "Gbps",
                onChange:function () {
                    view.calculate('up');
                }
            }));
            this.range2.push($("#range2_3").ionRangeSlider({
                type: "single",
                min: 0,
                max: 1000,
                step: 100,
                grid: true,
                from: 700,
                from_min:700,
                grid_snap: true,
                postfix: "Gbps",
                onChange:function () {
                    view.calculate('up');
                }
            }));
            $("input[name='ip-count']").jNum({
                onChange:function (dom) {
                    if($(dom).closest('.modal').attr('id') == 'add_resource'){
                        view.calculate('add')
                    }else {
                        view.calculate('up')
                    }
                }
            });
            this.table1Init();
        },
        table1Init:function () {
            var view = this;
            common.initTable(
                "#resource_1",
                common.urls.resourceSelect,
                model.get('table_columns1'),
                function(d) {
                    return $.extend({}, d);
                },
                view.router
            );
        },
        //计算价钱
        calculate:function (type) {
            var count = 0;
            if(type == 'add'){
                var dom1 = $('#add_resource .form-body .form-group');
                count += parseInt(dom1.eq(0).find('input[type="radio"]:checked').data('price'));
                count += parseInt(dom1.eq(1).find('input[type="radio"]:checked').data('price'));
                var i = 0;
                while (i < 3){
                    count += parseInt(dom1.eq(i + 2).find('input[type="text"]').val());
                    i ++;
                }
                var time1 = dom1.eq(5).find('.btn.green').text().replace('个月','');
                time1.indexOf('年') > -1 ? time1 = parseInt(time1) * 12 : time1 = parseInt(time1);
                count *= time1;
                count *= parseInt(dom1.eq(6).find('input[type="number"]').val());
                $('.add-resource-price').text('￥' + count);
            }else {
                var dom2 = $('#upgrade_resource .form-body .form-group');
                var j = 0;
                while (j < 3){
                    count += parseInt(dom2.eq(j + 1).find('input[type="text"]').val());
                    j ++;
                }
                var time2 = dom2.eq(5).find('.btn.green').text().replace('个月','');
                if(time2 != 0){
                    time2.indexOf('年') > -1 ? time2 = parseInt(time2) *12 : time2 = parseInt(time2);
                    count *= time2 + 1;
                }
                $('.upgrade-resource-price').text('￥' + count);
            }
        },
        handle:function () {
            //单选框点击事件
            this.$el.on('change','.form-group .md-radio>input[type="radio"]',this,function(e){
                if($(this).closest('.modal').attr('id') == 'add_resource'){
                    e.data.calculate('add');
                }else {
                    e.data.calculate('up');
                }
            });
            //购买时长button点击效果
            this.$el.on('click','.time-buy>.btn',this,function(e){
                $(this).addClass('green').removeClass('btn-default');
                $(this).siblings().addClass('btn-default').removeClass('green');
                $(this).siblings().each(function (ind,dom) {
                    $(dom).html($(dom).html().replace('个月',''))
                });
                if($(this).text().indexOf('个月') == -1 && $(this).text().indexOf('年') == -1){
                    $(this).text($(this).text() + '个月');
                }
                if($(this).closest('.modal').attr('id') == 'add_resource'){
                    e.data.calculate('add');
                }else {
                    e.data.calculate('up');
                }
            });

            //新增——显示
            this.$el.on('click','#resource_1_add',this,function(e){
                e.data.calculate('add');
                $('#add_resource').modal('show');
                e.preventDefault();
            });
            //新增——添加资源
            this.$el.on('click','#submit_buySure',this,function(e){
                var Group = $('#add_resource .form-body .form-group');
                var Tr = '<tr>';
                Tr += '<td>'+Group.eq(0).find("input:checked").next().data("value")+'</td>'+
                '<td>'+Group.eq(1).find("input:checked").next().data("value")+'</td>'+
                '<td>'+Group.eq(2).find("input[type='text']").val()+'</td>'+
                '<td>'+Group.eq(3).find("input[type='text']").val()+'</td>'+
                '<td>'+Group.eq(4).find("input[type='text']").val()+'</td>'+
                '<td>'+Group.eq(5).find(".btn.green").text()+'</td>'+
                '<td>'+Group.eq(6).find("input[type='number']").val()+'</td>'+
                '<td class="text-danger">'+Group.eq(7).find(".form-control-static").text()+'</td>'+
                '<td><span class="td-remove" style="cursor: pointer" title="删除"><i class="fa fa-minus-circle"></i></span></td>';
                Tr += '</tr>';
                $('.add_resource_detail table tbody').append(Tr);
                $('.add_resource_detail').show();
                e.preventDefault();
            });
            //新增——删除资源
            this.$el.on('click','.td-remove',this,function (e) {
                if($(this).closest('tbody').children().length == 1){
                    $('.add_resource_detail').hide();
                }
                $(this).closest('tr').remove();
            });
            //新增——购买资源
            this.$el.on('click','#submit_buyResource',this,function(e){
                var TR = $('.add_resource_detail table tbody>tr');
                var data = [];
                var region = e.data.region;
                var operator = e.data.operator;
                var newTime = new Date();
                var createTime = common.getFormatDate(newTime);
                var view = e.data;
                if(TR.length > 0){
                    TR.each(function (i,e) {
                        var child = $(this).children();
                        var times = child.eq(5).text();
                        var expireDate = new Date();
                        if(times.indexOf('年') > - 1){
                            times = parseInt(times.replace('年',''));
                            expireDate.setFullYear(expireDate.getFullYear()+times);
                            times = times*12
                        }else {
                            times = parseInt(times.replace('个月',''));
                            expireDate.setMonth(expireDate.getMonth()+times);
                        }
                        data.push({
                            terName:region[child.eq(0).text()],
                            ciruitTypes:operator[child.eq(1).text()],
                            protectNum:parseInt(child.eq(6).text()),
                            bandWidth:parseInt(child.eq(2).text()),
                            guaranteedPeek:parseInt(child.eq(3).text()),
                            elasticPeak:parseInt(child.eq(4).text()),
                            purchaseTime:times,
                            createTime:createTime,
                            expireDate:common.getFormatDate(expireDate),
                            price:parseInt(child.eq(7).text().replace('￥',''))
                        })
                    });
                    common.request(
                        common.urls.resourceInsert,{resource:JSON.stringify(data)},
                        function (json) {
                            toastr.success(json.message);
                            $('#add_resource').modal('hide');
                            view.table1Init();
                        }
                    );
                }else {
                    toastr.error('请添加资源');
                }
                e.preventDefault();
            });
            //升级——显示
            this.$el.on('click','tr>td .resource-up.green',this,function(e){
                var TD = $(this).closest('tr').children();
                $('#upgrade_resource').find('.ip-message').text(TD.eq(0).text());
                //滚轮
                $.each(e.data.range2,function (ind,dom) {
                    var obj = dom.data("ionRangeSlider");
                    var str = '';
                    ind == 0 ? str = 'M' : str = 'G';
                    obj.update({
                        from:parseInt(TD.eq(ind+3).text().replace(str,'')),
                        from_min:parseInt(TD.eq(ind+3).text().replace(str,''))
                    });
                    obj.reset();
                });
                $('#upgrade_resource').find('.time-expire').text(TD.eq(-3).text());
                $('#upgrade_resource').find('.time-extend').text(TD.eq(-3).text());
                e.data.calculate('up');
                $('#upgrade_resource').data('id',$(this).data('id'));
                $('#upgrade_resource').data('state',$(this).data('state'));
                $('#upgrade_resource').modal('show');
                e.preventDefault();
            });
            //升级——延长时间计算
            this.$el.on('click','#upgrade_resource .time-buy>.btn',this,function(e){
                var sTime = $(this).closest('.form-group').prev().find('.form-control-static').text();
                var eTime = $(this).closest('.form-group').next().find('.form-control-static');
                var long = $(this).text();
                var time = new Date(sTime);
                if(long.indexOf('年') > - 1){
                    long = parseInt(long.replace('年',''));
                    time.setFullYear(time.getFullYear()+long);
                }else {
                    long = parseInt(long.replace('个月',''));
                    time.setMonth(time.getMonth()+long);
                }
                eTime.text(common.getFormatDate(new Date(time)));
            });
            //升级——购买资源
            this.$el.on('click','#submit_buyUp',this,function(e){
                var modal = $('#upgrade_resource');
                var view = e.data;
                var times = modal.find('.btn.green').text();
                times.indexOf('年') > -1 ? times = parseInt(times.replace('年','')) * 12 : times = parseInt(times.replace('个月',''));
                common.request(
                    common.urls.resourceUpdate,
                    {
                        id:parseInt(modal.data('id')),
                        state:parseInt(modal.data('state')),
                        bandWidth:parseInt($('#range2_1').val()),
                        guaranteedPeek:parseInt($('#range2_2').val()),
                        elasticPeak:parseInt($('#range2_3').val()),
                        purchaseTime:times,
                        expireDate:modal.find('.time-extend').text(),
                        price:parseInt(modal.find('.upgrade-resource-price').text().replace('￥',''))
                    },function (json) {
                        toastr.success(json.message);
                        $('#upgrade_resource').modal('hide');
                        view.table1Init();
                    }
                );
                e.preventDefault();
            });
        },
        remove: function() {
            this.$el.off();
            this.$el.empty();
        }
    });
    return View;
});