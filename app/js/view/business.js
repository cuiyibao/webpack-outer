/**
 * Created by bao on 2018/1/22.
 */
define([
    'backbone',
    'common',
    'tpl/business.html',
    'model/business',
    'datatimepicker',
    'toastr',
    'metronic'
], function(Backbone, common, text, tpl, model, datatimepicker, toastr, Metronic) {
    var View = Backbone.View.extend({
        el: '#page-content',
        template:_.template(tpl),
        initialize: function(router) {
            this.$el.html(this.template(model.toJSON()));
            this.router = router;
            this.search1 = {};
            this.search2 = {};
            this.dataTime = [];
            this.select2 = [];
            this.Form = {};
            this.wizard = {};
            this.ipArr = [];
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-top-center",
                "onclick": null,
                "showDuration": "1000",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };
            this.render();
            this.handle();
        },
        render: function() {
            this.searchChange1();
            this.table1Init();
            $.fn.datetimepicker.dates['zh-CN'] = {
                days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
                monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
                today: "今天",
                suffix: [],
                meridiem: ["上午", "下午"]
            }; //汉化
            this.dataTime.push($("#datetimeStart1").datetimepicker({
                format: 'yyyy-mm-dd',
                minView:'month',
                language: 'zh-CN',
                autoclose:true
            }).on("click",function(){
                $("#datetimeStart1").datetimepicker("setEndDate",$("#datetimeEnd1").val());
            }));
            this.dataTime.push($("#datetimeEnd1").datetimepicker({
                format: 'yyyy-mm-dd',
                minView:'month',
                language: 'zh-CN',
                autoclose:true
            }).on("click",function(){
                $("#datetimeEnd1").datetimepicker("setStartDate",$("#datetimeStart1").val());
            }));
            this.dataTime.push($("#datetimeStart2").datetimepicker({
                format: 'yyyy-mm-dd',
                minView:'month',
                language: 'zh-CN',
                autoclose:true
            }).on("click",function(){
                $("#datetimeStart2").datetimepicker("setEndDate",$("#datetimeEnd2").val());
            }));
            this.dataTime.push($("#datetimeEnd2").datetimepicker({
                format: 'yyyy-mm-dd',
                minView:'month',
                language: 'zh-CN',
                autoclose:true
            }).on("click",function(){
                $("#datetimeEnd2").datetimepicker("setStartDate",$("#datetimeStart2").val());
            }));

            var view = this;
            var form = $('#submit_form');
            var error = $('.alert-danger', form);
            var success = $('.alert-success', form);

            this.Form = form.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
                focusInvalid: true, // do not focus the last invalid input
                rules: {
                    ip: {required: true,ipv4:true},
                    port: {required: true,port:true},
                    ip1: {required: true,ipv4:true},
                    port1: {required: true,port:true}
                },
                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.attr("name") == "gender") { // for uniform radio buttons, insert the after the given container
                        error.insertAfter("#form_gender_error");
                    } else if (element.attr("name") == "payment[]") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_payment_error");
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavior
                    }
                    if(element.attr("type") == "checkbox"){
                        error.insertAfter(element.parent().parent())
                    }
                },
                invalidHandler: function (event, validator) { //display error alert on form submit
                    success.hide();
                    error.show();
                    Metronic.scrollTo(error, -200);
                },
                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
                },
                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },
                success: function (label) {
                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") { // for checkboxes and radio buttons, no need to show OK icon
                        label
                            .closest('.form-group').removeClass('has-error').addClass('has-success');
                        label.remove(); // remove error label here
                    } else { // display success icon for other inputs
                        label
                            .addClass('valid') // mark the current input as valid and display OK icon
                            .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                        label.remove();
                    }
                },
                submitHandler: function (form) {
                }
            });
            // default form wizard
            this.wizard = $('#add_ruleConfig').bootstrapWizard({
                'nextSelector': '.button-next',
                'lastSelector': '.button-submit',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index, clickedIndex) {
                    return false;
                },
                onFirst: function (tab, navigation, index) {
                    success.hide();
                    error.hide();
                    $('#submit_form .form-group').removeClass('has-success').removeClass('has-error');
                    view.handleTitle(tab, navigation, index);
                },
                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();
                    if (form.valid() == false) {
                        return false;
                    }
                    if(index == 2){
                        var obj = {},IS = true;
                        $('.tab2-dip').each(function(ind,dom){
                            if(!obj[$(dom).find('select.tab2-dip-ip').val()]){
                                obj[$(dom).find('select.tab2-dip-ip').val()] = $(dom).find('input.tab2-dip-port').val();
                            }else {
                                if(obj[$(dom).find('select.tab2-dip-ip').val()] == $(dom).find('input.tab2-dip-port').val()){
                                    IS = false;
                                }
                            }
                        });
                        if(IS == false){
                            $('.alert-danger').text("同一个清洗IP的端口号不能相同").show();
                            return false;
                        }
                    }
                    $('.alert-danger').hide();
                    view.handleTitle(tab, navigation, index);
                },
                onLast: function (tab, navigation, index) {
                    var url = '',param = {};
                    param = {
                        busRule:$('#add_ruleConfig input[name="rule"]:checked').val(),
                        protocal:$('#add_ruleConfig input[name="protocol"]:checked').val(),
                        sourceIp:$('#add_ruleConfig input[name="ip"]').val(),
                        sourcePort:$('#add_ruleConfig input[name="port"]').val(),
                    };
                    if($('#add_ruleConfig').data('opera') == 'update'){
                        url = common.urls.ruleUpdate;
                        param.ruleId = $('#business_2 .checkboxes:checked').data('id');
                        param.busId = $('#business_2').data('id');
                    }else {
                        url = common.urls.ruleInsert;
                        param.busId = $('#business_2').data('id');
                    }
                    var cDom = $('#add_ruleConfig .tab2-dip');
                    var rinseIp = '',rinsePort = '';
                    $('#add_ruleConfig .tab2-dip').each(function (ind,dom) {
                        rinseIp += $(this).find('select.tab2-dip-ip').val() + ',';
                        rinsePort += $(this).find('.tab2-dip-port').val() + ',';
                    });
                    rinseIp = rinseIp.substring(0,rinseIp.length - 1);
                    rinsePort = rinsePort.substring(0,rinsePort.length - 1);
                    param.rinseIp = rinseIp;
                    param.rinsePort = rinsePort;

                    common.request(
                        url,param,function (json) {
                            toastr.success(json.message);
                            $('#add_ruleConfig').modal('hide');
                            view.table2Init();
                        }
                    );
                },
                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();
                    view.handleTitle(tab, navigation, index);
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#add_ruleConfig').find('.progress-bar').css({
                        width: $percent + '%'
                    });
                }
            });
            $('#add_ruleConfig').find(".button-submit").hide();
            $('#add_ruleConfig').find('.button-previous').hide();

            this.select2Init();
        },
        searchChange1:function () {
            var view = this;
            $('.row.page1 .form-body').find('select.form-control,input.form-control').each(function (i,e) {
                view.search1[$(this).data('param')] = $(this).val();
            });
            model.set({'searchParam1':view.search1},{"validate":true});
        },
        searchChange2:function () {
            var view = this;
            $('.row.page2 .form-body').find('select.form-control,input.form-control').each(function (i,e) {
                view.search2[$(this).data('param')] = $(this).val();
            });
            model.set({'searchParam2':view.search2},{"validate":true});
        },
        table1Init:function () {
            var view = this;
            common.initTable(
                "#business_1",
                common.urls.businessSelect,
                model.get('table_columns1'),
                function(d) {
                    return $.extend({}, d, model.get('searchParam1'));
                },
                view.router
            );
        },
        table2Init:function () {
            var view = this;
            common.initTable(
                "#business_2",
                common.urls.ruleSelect,
                model.get('table_columns2'),
                function(d) {
                    return $.extend({}, d, model.get('searchParam2'));
                },
                view.router
            );
        },
        handleTitle:function(tab, navigation, index) {
            var total = navigation.find('li').length;
            var current = index + 1;
            $('.step-title', $('#add_ruleConfig')).text('第' + (index + 1) + '步' );
            jQuery('li', $('#add_ruleConfig')).removeClass("done");
            var li_list = navigation.find('li');
            for (var i = 0; i < index; i++) {
                jQuery(li_list[i]).addClass("done");
            }
            if (current == 1) {
                $('#add_ruleConfig').find('.button-previous').hide();
            } else {
                $('#add_ruleConfig').find('.button-previous').show();
            }
            if (current >= total) {
                $('#add_ruleConfig').find('.button-next').hide();
                $('#add_ruleConfig').find('.button-submit').show();
                this.displayConfirm();
            } else {
                $('#add_ruleConfig').find('.button-next').show();
                $('#add_ruleConfig').find('.button-submit').hide();
            }
            Metronic.scrollTo($('.page-title'));
        },
        handle:function () {
            // 重置
            this.$el.on("click",".search-clear",this,function(e){
                e.preventDefault();
                $(this).closest('.form-body').find('input.form-control').val('');
                if($(this).data('page') == '1'){
                    e.data.searchChange1();
                    e.data.table1Init();
                }else {
                    e.data.searchChange2();
                    e.data.table2Init();
                }
            });
            // 搜索
            this.$el.on("click",".search-reload",this,function(e){
                e.preventDefault();
                if($(this).data('page') == '1'){
                    e.data.searchChange1();
                    e.data.table1Init();
                }else {
                    e.data.searchChange2();
                    e.data.table2Init();
                }
            });
            // 添加业务组——显示
            this.$el.on("click","#business_1_add",function(e){
                $('#add_business').find('.modal-title').text('添加新业务组');
                $('#add_business').find('input[type="text"]').val('');
                $('#add_business').modal('show');
            });
            // 添加|修改业务组——保存
            this.$el.on("click","#add_business .btn.blue",this,function(e){
                if($('#add_business').find('.modal-title').text() == '修改业务组'){
                    common.request(
                        common.urls.businessUpdate,
                        {
                            id:$('#add_business').data('id'),
                            busName:$('#add_business .add-form-group').val()
                        },function (json) {
                            toastr.success(json.message);
                            $('#add_business').modal('hide');
                            e.data.table1Init();
                        }
                    );
                }else {
                    common.request(
                        common.urls.businessInsert,
                        {
                            busName:$('#add_business .add-form-group').val(),
                            createTime:common.getFormatDate(new Date())
                        },function (json) {
                            toastr.success(json.message);
                            $('#add_business').modal('hide');
                            e.data.table1Init();
                        }
                    );
                }
                e.preventDefault();
            });
            // 删除业务组
            this.$el.on("click","#business_1_delete",this,function(e){
                var input = $('#business_1 input[type="checkbox"].checkboxes:checked');
                var ids = '';
                input.each(function (ind,dom) {
                    ids += $(dom).data('id') + ',';
                });
                ids = ids.substring(0,ids.length - 1);
                common.request(
                    common.urls.businessDelete,
                    {
                        id:ids
                    },function (json) {
                        toastr.success(json.message);
                        e.data.table1Init();
                    }
                );
            });
            // 修改业务组
            this.$el.on("click","#business_1_modify",function(e){
                var checked = $('#business_1 .checkboxes:checked');
                if(checked.length == 0){
                    common.alert('请选择业务组');
                }else if(checked.length > 1){
                    common.alert('请选择一行业务组进行修改');
                }else {
                    $('#add_business').find('.modal-title').text('修改业务组');
                    $('#add_business').data('id',checked.data('id'));
                    $('.add-form-group').val(checked.closest('tr').children(':nth-child(2)').text());
                    $('#add_business').modal('show');
                }
            });
            //appkey下载
            this.$el.on("click","#business_1 .appLoad.green",this,function(e){
                window.open(common.ip + '/dshield-outer-system/business/downloadFileAppkey?businessId=' + $(this).data('id'));
            });
            //SDK下载
            this.$el.on("click","#business_1 .sdkLoad.green",this,function(e){
                window.open(common.ip + '/dshield-outer-system/business/downloadFileSDK');
            });

            //进规则页
            this.$el.on("click","table tr>td>.business-rule",this,function(e){
                $('.page1').hide();
                $('.page2').show();
                $('#business_2').data('id',$(this).data('id'));
                $('#business_2').data('name',$(this).data('name'));
                common.request(
                    common.urls.selectByUserId,'',function (json) {    
                        var tel = '<option value=""></option>';
						if(json.data && json.data.length>0){
							for(var i=0;i<json.data.length;i++){
								tel += '<option value="'+json.data[i]+'">'+json.data[i]+'</option>';
								e.data.ipArr.push(json.data[i]);
							}
						}
                        $('select[name="ip1"]').html(tel);
                    }
                );
                e.data.search2['busId'] = $(this).data('id');
                e.data.searchChange2();
                e.data.table2Init();
            });
            // 退业务组页
            this.$el.on("click",".page-title-return",this,function(e){
                $('.page1').show();
                $('.page2').hide();
                e.data.table1Init();
            });
            // 添加规则
            this.$el.on("click","#business_2_add",this,function(e){
                $('.add_ruleConfig_name').text($('#business_2').data('name'));
                $('#add_ruleConfig').data('opera','add');
                e.data.wizard.bootstrapWizard('first');
                $('input[name="protocol"]').eq(0).click();
                $('.tab2-dip').each(function(ind,dom){
                    if(ind != 0){
                        $(dom).remove();
                    }
                });
                $('#add_ruleConfig input.form-control').val('');
                $('#add_ruleConfig select.form-control').val('').trigger('change');
                $('#add_ruleConfig').modal('show');
            });
            // 删除规则
            this.$el.on("click","#business_2_delete",this,function(e){
                var input = $('#business_2 input[type="checkbox"].checkboxes:checked');
                var ids = '';
                input.each(function (ind,dom) {
                    ids += $(dom).data('id') + ',';
                });
                ids = ids.substring(0,ids.length - 1);
                common.request(
                    common.urls.ruleDelete,{
                    ruleId:ids,
                    busId:$('#business_2').data('id')
                    },function (json) {
                        toastr.success(json.message);
                        e.data.table2Init();
                    }
                );
            });
            // 修改规则
            this.$el.on("click","#business_2_modify",this,function(e){
                var checked = $('#business_2 .checkboxes:checked');
                var view = e.data;
                if(checked.length == 0){
                    common.alert('请选择规则');
                }else if(checked.length > 1){
                    common.alert('请选择一条规则进行修改');
                }else{
                    view.wizard.bootstrapWizard('first');
                    $('.add_ruleConfig_name').text($('#business_2').data('name'));
                	$('#add_ruleConfig').data('opera','update');
                    var TR = checked.closest('tr');
                    var rule = TR.children().eq(4).text();
                    var protocol = TR.children().eq(3).text();
                    if(protocol == 'HTTP'){
                        $('input[name="protocol"]').eq(1).click();
                    }else {
                        $('input[name="protocol"]').eq(0).click();
                    }
                    var sip = TR.children().eq(1).text();
                    var sport = TR.children().eq(2).text();
                    var ARR = TR.find('.ip-detail').data('arr');
                    ARR = decodeURI(ARR);
                    ARR = JSON.parse(ARR);
                    $('#tab2 input[name="ip"]').val(sip);
                    $('#tab2 input[name="port"]').val(sport);
                    if(ARR && ARR.length>0){
                        $('#tab2 input[name="ip1"]').val(ARR[0].rinseIp);
                        $('#tab2 input[name="port1"]').val(ARR[0].rinsePort);
                        $('.tab2-dip').each(function(ind,dom){
                            if(ind != 0){
                                $(dom).remove();
                            }
                        });
                        $.each(ARR,function (ind,obj) {
                            if(ind != 0){
                                var tel = '<option value=""></option>';
                                $.each(e.data.ipArr,function (index,ip) {
                                    tel += '<option value="'+ip+'">'+ip+'</option>';
                                });
                                var dom_add = '<div class="row tab2-dip">'+
                                    '<div class="form-group col-md-5">'+
                                    '<label class="control-label col-md-6">'+
                                    '清洗IP <span class="required"> * </span>'+
                                    '</label>'+
                                    '<div class="col-md-6">'+
                                    '<select class="form-control tab2-dip-ip" name="ip'+ind+1+'" value="'+obj.rinseIp+'">'+
                                    tel+
                                    '</select>'+
                                    '</div>'+
                                    '</div>'+
                                    '<div class="form-group col-md-5">'+
                                    '<label class="control-label col-md-4">'+
                                    '端口 <span class="required"> * </span>'+
                                    '</label>'+
                                    '<div class="col-md-6">'+
                                    '<input class="form-control tab2-dip-port" type="number"  name="port'+ind+1+'" value="'+obj.rinsePort+'">'+
                                    '</div>'+
                                    '</div>'+
                                    '</div>'+
                                    '</div>';
                                $('#tab2 .tab2-dip-list').append(dom_add);
                            }else {
                                $('select[name="ip1"]').val(obj.rinseIp);
                                $('input[name="port1"]').val(obj.rinsePort);
                            }
                        });
                        view.select2Init();
                        $('select.tab2-dip-ip').each(function (ind,dom) {
                            if(ind != 0){
                                $(this).val($(this).attr('value')).trigger('change');
                            }
                        });
                    }
                    $('#tab2 a.plus_btn').data('num',ARR.length+1);
                    $('#add_ruleConfig').modal('show');
                }
            });
            // 点击增加IP&端口配置
            this.$el.on('click','#tab2 a.plus_btn',this,function(e){
                var tel = '<option value=""></option>';
                $.each(e.data.ipArr,function (ind,ip) {
                    tel += '<option value="'+ip+'">'+ip+'</option>';
                });
                var dom_add = '<div class="row tab2-dip">'+
                    '<div class="form-group col-md-5">'+
                    '<label class="control-label col-md-6">'+
                    '清洗IP <span class="required"> * </span>'+
                    '</label>'+
                    '<div class="col-md-6">'+
                    '<select class="form-control tab2-dip-ip" name="ip'+$(this).data('num')+'">'+
                    tel+
                    '</select>'+
                    '</div>'+
                    '</div>'+
                    '<div class="form-group col-md-5">'+
                    '<label class="control-label col-md-4">'+
                    '端口 <span class="required"> * </span>'+
                    '</label>'+
                    '<div class="col-md-6">'+
                    '<input class="form-control tab2-dip-port" type="number"  name="port'+$(this).data('num')+'">'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                $(this).closest('.tab2-dip-list').append(dom_add);
                e.data.Form.settings.rules["ip"+$(this).data('num')] = {required: true,ipv4:true};
                e.data.Form.settings.rules["port"+$(this).data('num')] = {required: true,port:true};
                $(this).data('num',parseInt($(this).data('num'))+1);
                e.data.select2Init();
            });
            // 点击减号删除本条数据
            this.$el.on('click','#tab2 a.plus_minus',this,function(e){
                var _length = $(this).closest('.tab2-dip-list').find('.row').length;
                if (_length > 1) {
                    $(this).closest('.tab2-dip-list').children(':last-child').remove();
                    $('#tab2 a.plus_btn').data('num',parseInt($('#tab2 a.plus_btn').data('num'))-1);
                    delete e.data.Form.settings.rules["ip"+$('#tab2 a.plus_btn').data('num')];
                    delete e.data.Form.settings.rules["port"+$('#tab2 a.plus_btn').data('num')];
                }
            });
            //清洗ip列表
            this.$el.on("click",".ip-detail",this,function(e){
                var arr = $(this).data('arr'),html='';
                arr = decodeURI(arr);
                arr = JSON.parse(arr);
                if(arr.length == 0){return;}
                $.each(arr,function (ind,e) {
                    html += '<div class="row">'+
                        '<div class="form-group col-md-6">'+
                        '<label class="control-label col-md-4">'+
                        '清洗IP'+
                        '</label>'+
                        '<div class="col-md-8">'+
                        '<p class="form-control-static">'+e.rinseIp+'</p>'+
                        '</div>'+
                        '</div>'+
                        '<div class="form-group col-md-6">'+
                        '<label class="control-label col-md-4">'+
                        '端口'+
                        '</label>'+
                        '<div class="col-md-8">'+
                        '<p class="form-control-static">'+e.rinsePort+'</p>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
                });
                $('#ip_detail').find('.form-body').html(html);
                $('#ip_detail').modal('show')
            });
        },
        select2Init:function () {
            $.each(this.select2,function (i,e) {
                if(e){e.select2('destroy');}
            });
            this.select2.push($(document).find('select').select2());
        },
        displayConfirm:function () {
            var html = '';
            var Tem1 = function (label,p) {
                return '<div class="row">'+
                    '<div class="">'+
                    '<label class="control-label col-md-3" style="width: 20.6%">'+
                    label+
                    '</label>'+
                    '<div class="col-md-4">'+
                    '<p class="form-control-static">'+p+'</p>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
            };
            var Tem2 = function (label1,ip1,label2,ip2) {
                return '<div class="row">'+
                    '<div class="col-md-5">'+
                    '<label class="control-label col-md-6">'+
                    label1+
                    '</label>'+
                    '<div class="col-md-6">'+
                    '<p class="form-control-static">'+ip1+'</p>'+
                    '</div>'+
                    '</div>'+
                    '<div class="col-md-5">'+
                    '<label class="control-label col-md-4">'+
                    label2+
                    '</label>'+
                    '<div class="col-md-6">'+
                    '<p class="form-control-static">'+ip2+'</p>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
            };
            html += '<h3 class="block">确认配置</h3>';
            html += '<h4 class="form-section">'+$("#tab1>.block").text()+'</h4>';
            html += Tem1($('.tab1-business').children('label').text(),$('.tab1-business').find('.add_ruleConfig_name').text());
            html += Tem1($('.tab1-rule').children('label').text(),$('.tab1-rule').find('input:checked').next().text());
            html += Tem1($('.tab1-protocol').children('label').text(),$('.tab1-protocol').find('input:checked').next().text());
            html += '<h4 class="form-section" style="margin-top: 0">'+$("#tab2>.form-section").eq(0).text()+'</h4>';
            html += Tem2($('.tab2-sip').children('label').text(),$('.tab2-sip').find('input').val(),
                $('.tab2-sport').children('label').text(),$('.tab2-sport').find('input').val());
            html += '<h4 class="form-section" style="margin-top: 0">'+$("#tab2>.form-section").eq(1).text()+'</h4>';
            $('.tab2-dip').each(function (ind,dom) {
                var ipDom = $(this).children('.form-group').eq(0);
                var portDom = $(this).children('.form-group').eq(1);
                html += Tem2(ipDom.children('label').text(),ipDom.find('select').val(),
                    portDom.children('label').text(),portDom.find('input').val());
            });
            html = html.replace(/ \*/g,'');
            $('#tab3').html(html);
        },
        remove: function() {
            this.$el.off();
            this.$el.empty();
            //销毁实例
            $.each(this.dataTime,function (i,e) {
                if(e){
                    e.datetimepicker('remove');
                }
            });
            $.each(this.select2,function (i,e) {
                if(e){e.select2('destroy');}
            });
        }
    });
    return View;
});