/**
 * Created by bao on 2018/1/22.
 */
define([
    'backbone',
    'common',
    'tpl/ruleconfig.html',
    'model/ruleconfig',
    'metronic',
    'datatimepicker',
    'toastr'
], function(Backbone, common, text, tpl, model, Metronic, datatimepicker, toastr) {
    var View = Backbone.View.extend({
        el: '#page-content',
        template:_.template(tpl),
        initialize: function(router) {
            this.$el.html(this.template(model.toJSON()));
            this.router = router;
            this.select2 = [];
            this.Form = {};
            this.render();
            this.handle();
        },
        render: function() {
            var view = this;
            var form = $('#submit_form');
            var error = $('.alert-danger', form);
            var success = $('.alert-success', form);

            this.Form = form.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
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
                    }
                },
                submitHandler: function (form) {
                    // success.show();
                    // error.hide();
                    ///TODO POST callback
                    // $('#myModal_gif').show();
                    // common.post(
                    //     common.urls.insert,{
                    //         "web":view.result['web'],
                    //         "protocol":view.result['protocol'],
                    //         "returnBandwidth":view.result['returnBandwidth'],
                    //         "cleanFlow":view.result['cleanFlow'],
                    //         "ispIpPort":view.result['ispIpPort']
                    //     },
                    //     function(data){
                    //
                    //         if(data.status =="200"){
                    //             $('#myModal_gif').hide();
                    //             toastr.success("提交成功");
                    //             view.router.navigate("config", {trigger: true});
                    //         }else{
                    //             $('#myModal_gif').hide();
                    //             toastr.error(data.message);
                    //         }
                    //     },
                    //     view.router
                    // );
                }
            });
            // default form wizard
            $('#form_wizard_1').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index, clickedIndex) {
                    return false;
                },
                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();
                    if (form.valid() == false) {
                        return false;
                    }
                    view.handleTitle(tab, navigation, index);
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
                    $('#form_wizard_1').find('.progress-bar').css({
                        width: $percent + '%'
                    });
                }
            });
            $('#form_wizard_1').find(".button-submit").hide();
            $('#form_wizard_1').find('.button-previous').hide();

            this.select2Init();
        },
        handle:function () {
            // 点击增加IP&端口配置
            this.$el.on('click','#tab2 a.plus_btn',this,function(e){
                var dom_add = '<div class="row tab2-dip">'+
                '<div class="form-group col-md-5">'+
                '<label class="control-label col-md-6">'+
                '清洗IP <span class="required"> * </span>'+
                '</label>'+
                '<div class="col-md-6">'+
                '<select class="form-control" name="ip'+$(this).data('num')+'">'+
                '<option value=""></option>'+
                '<option value="1.1.1.1">1.1.1.1</option>'+
                '<option value="1.1.1.1">1.1.1.1</option>'+
                '<option value="1.1.1.1">1.1.1.1</option>'+
                '</select>'+
                '</div>'+
                '</div>'+
                '<div class="form-group col-md-5">'+
                '<label class="control-label col-md-2">'+
                '端口 <span class="required"> * </span>'+
                '</label>'+
                '<div class="col-md-6">'+
                '<input class="form-control" type="number"  name="port'+$(this).data('num')+'">'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</div>';
                $(this).closest('.col-md-12').append(dom_add);
                e.data.Form.settings.rules["ip"+$(this).data('num')] = {required: true,ipv4:true};
                e.data.Form.settings.rules["port"+$(this).data('num')] = {required: true,port:true};
                $(this).data('num',parseInt($(this).data('num'))+1);
                e.data.select2Init();
            });
            // 点击减号删除本条数据
            this.$el.on('click','#tab2 a.plus_minus',this,function(e){
                var _length = $(this).closest('.col-md-12').find('.row').length;
                if (_length > 1) {
                    $(this).closest('.col-md-12').children(':last-child').remove();
                    $('#tab2 a.plus_btn').data('num',parseInt($('#tab2 a.plus_btn').data('num'))-1);
                    delete e.data.Form.settings.rules["ip"+$('#tab2 a.plus_btn').data('num')];
                    delete e.data.Form.settings.rules["port"+$('#tab2 a.plus_btn').data('num')];
                }
            });
        },
        select2Init:function () {
            $.each(this.select2,function (i,e) {
                if(e){e.select2('destroy');}
            });
            this.select2.push($(document).find('select').select2());
        },
        handleTitle:function(tab, navigation, index) {
            var total = navigation.find('li').length;
            var current = index + 1;
            $('.step-title', $('#form_wizard_1')).text('第' + (index + 1) + '步' );
            jQuery('li', $('#form_wizard_1')).removeClass("done");
            var li_list = navigation.find('li');
            for (var i = 0; i < index; i++) {
                jQuery(li_list[i]).addClass("done");
            }
            if (current == 1) {
                $('#form_wizard_1').find('.button-previous').hide();
            } else {
                $('#form_wizard_1').find('.button-previous').show();
            }
            if (current >= total) {
                $('#form_wizard_1').find('.button-next').hide();
                $('#form_wizard_1').find('.button-submit').show();
                this.displayConfirm();
            } else {
                $('#form_wizard_1').find('.button-next').show();
                $('#form_wizard_1').find('.button-submit').hide();
            }
            Metronic.scrollTo($('.page-title'));
        },
        displayConfirm:function () {
            var html = '';
            var Tem1 = function (label,p) {
                return '<div class="row">'+
                    '<div class="form-group">'+
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
                    '<div class="form-group col-md-5">'+
                    '<label class="control-label col-md-6">'+
                    label1+
                    '</label>'+
                    '<div class="col-md-6">'+
                    '<p class="form-control-static">'+ip1+'</p>'+
                    '</div>'+
                    '</div>'+
                    '<div class="form-group col-md-5">'+
                    '<label class="control-label col-md-2">'+
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
            html += Tem1($('.tab1-business').children('label').text(),$('.tab1-business').find('select>option:selected').text());
            html += Tem1($('.tab1-rule').children('label').text(),$('.tab1-rule').find('input:checked').next().text());
            html += Tem1($('.tab1-protocol').children('label').text(),$('.tab1-protocol').find('input:checked').next().text());
            html += '<h4 class="form-section">'+$("#tab2>.form-section").eq(0).text()+'</h4>';
            html += Tem2($('.tab2-sip').children('label').text(),$('.tab2-sip').find('input').val(),
                    $('.tab2-sport').children('label').text(),$('.tab2-sport').find('input').val());
            html += '<h4 class="form-section">'+$("#tab2>.form-section").eq(1).text()+'</h4>';
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
            $.each(this.select2,function (i,e) {
                if(e){e.select2('destroy');}
            });
        }
    });
    return View;
});