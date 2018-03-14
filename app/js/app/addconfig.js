define([
	'backbone',
	'common',
	'tpl/addconfig.html',
	'metronic',
    'toastr',
	'ion_rangeSlider',
	'wizard'
], function(Backbone, common,tpl,Metronic,toastr) {
	var View = Backbone.View.extend({
		el: '#page-content',
		initialize: function(router) {
            this.$el.html(tpl);
			this.render();
            this.result={
                web:0,
                protocol:"",
                returnBandwidth:0,
                cleanFlow:0,
                ispIpPort:""
            };
            this.router = router;
		},	
		render: function() {
            var view =this;		
			$("#range").ionRangeSlider({
			    type: "single",
			    min: 100,
			    max: 1000,
			    step: 100,
			    grid: true,
			    from: 0,
			    grid_snap: true,
			    postfix: "Gb/s"
			});
			$("#range1").ionRangeSlider({
			    type: "single",
			    min: 100,
			    max: 1000,
			    step: 100,
			    grid: true,
			    from: 0,
			    grid_snap: true,
			    postfix: "Gb"
			});

           

            var form = $('#submit_form');
            var error = $('.alert-danger', form);
            var success = $('.alert-success', form);

         	form.validate({
         		errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
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
                    success.show();
                    error.hide();
                    ///TODO POST callback
                    $('#myModal_gif').show();
                    common.post(
                        common.urls.insert,{
                            "web":view.result['web'],
                            "protocol":view.result['protocol'],
                            "returnBandwidth":view.result['returnBandwidth'],
                            "cleanFlow":view.result['cleanFlow'],
                            "ispIpPort":view.result['ispIpPort']
                        },
                        function(data){
                            
                            if(data.status =="200"){
                              $('#myModal_gif').hide();
                                toastr.success("提交成功");
                                view.router.navigate("config", {trigger: true});
                            }else{
                              $('#myModal_gif').hide();
                                toastr.error(data.message);
                            }
                        },
                        view.router
                    );
                }
            });

            var displayConfirm = function() {
            	var html="",text="";
                $('#tab3 .form-control-static', form).each(function(){
                	
                    var input = $('[name="'+$(this).attr("data-display")+'"]', form);
                    if (input.is(":radio")||input.is(":checkbox")) {
                        input = $('[name="'+$(this).attr("data-display")+'"]:checked', form);
                    }
                    if (input.is(":text") || input.is("textarea")) {
                        $(this).html(input.val());
                    } else if (input.is("select")) {
                        $(this).html(input.find('option:selected').text());
                    } else if (input.is(":radio") && input.is(":checked")) {
                        $(this).html(input.parent().find('label').text());
                    } else if (input.is(":checkbox") && input.is(":checked")) {
                        $(this).html(input.parent().find('label').text());
                    } else if ($(this).attr("data-display") == 'ispIpPort') {
   
                    	var namelist={"CMCC":"移动","CUCC":'联通',"CTCC":"电信"};
                       	
               		if($("[name='ip-CMCC']").length){
                            var cmcc_ip = "",arr = [];
                            $("[name='ip-CMCC']").each(function(i,e){
                                arr[i] = $(e).val();
                            });
                             $("[name='port-CMCC']").each(function(i,e){
                                arr[i] += ',' + $(e).val();
                            });
               	 	    html += namelist['CMCC'];
                            $.each(arr,function(i,e){
                                html += e.split(',')[0] + ":" + e.split(',')[1]  + ',';
                            });
                            html += '<br/>';
                            text += "CMCC;";
                            $.each(arr,function(i,e){
                                text += e.split(',')[0] + "," + e.split(',')[1]  + ';';
                            });
                            text = text.substring(0,text.length-1);
                            text += '|';
                        }else{
                            text +="CMCC,,|"
                        }
               		if($("[name='ip-CUCC']").length){
               			// html += namelist["CUCC"]+" : "+$("[name='ip-CUCC']").val()+":"+$("[name='port-CUCC']").val()+'<br/>';
               		 //    text +="CUCC,"+$("[name='ip-CUCC']").val()+","+$("[name='port-CUCC']").val()+'|';
                            var cmcc_ip = "",arr = [];
                            $("[name='ip-CUCC']").each(function(i,e){
                                arr[i] = $(e).val();
                            });
                             $("[name='port-CUCC']").each(function(i,e){
                                arr[i] += ',' + $(e).val();
                            });
                            html += namelist['CUCC'];
                            $.each(arr,function(i,e){
                                html += e.split(',')[0] + ":" + e.split(',')[1]  + ',';
                            });
                            html += '<br/>';
                            text += "CUCC;";
                            $.each(arr,function(i,e){
                                text += e.split(',')[0] + "," + e.split(',')[1]  + ';';
                            });
                            text = text.substring(0,text.length-1);
                            text += '|';
                        }else{
                            text +="CUCC,,|"
                        }
               		if($("[name='ip-CTCC']").length){
               			// html += namelist["CTCC"]+" : "+$("[name='ip-CTCC']").val()+":"+$("[name='port-CTCC']").val()+'<br/>';
               		 //    text +="CTCC,"+$("[name='ip-CTCC']").val()+","+$("[name='port-CTCC']").val()+'|';
                            var cmcc_ip = "",arr = [];
                            $("[name='ip-CTCC']").each(function(i,e){
                                arr[i] = $(e).val();
                            });
                             $("[name='port-CTCC']").each(function(i,e){
                                arr[i] += ',' + $(e).val();
                            });
                            html += namelist['CTCC'];
                            $.each(arr,function(i,e){
                                html += e.split(',')[0] + ":" + e.split(',')[1]  + ',';
                            });
                            html += '<br/>';
                            text += "CTCC;";
                            $.each(arr,function(i,e){
                                text += e.split(',')[0] + "," + e.split(',')[1]  + ';';
                            });
                            text = text.substring(0,text.length-1);
                            // text += '|';
                        }else{
                            text +="CTCC,,"
                        }

                       	$(this).html(html);

                        view.result['ispIpPort'] = text;
                    }

                    if($(this).attr("data-display") == 'web'){
                        view.result['web'] = input.parent().find('label').text().replace(/^\s+|\s+$/g,"")=='web服务'?0:1;
                    }else if($(this).attr("data-display") == 'protocol'){
                        view.result['protocol'] = input.parent().find('label').data("value");
                    }else if($(this).attr("data-display") == 'cleanFlow'){
                        view.result['cleanFlow'] = parseInt(input.val());
                    }else if($(this).attr("data-display") == 'returnBandwidth')
                        view.result['returnBandwidth'] = parseInt(input.val());
                });
            }
            this.$el.on('change','[name = "checkbox1"]',function(e){
            	var namelist={"CMCC":"移动","CUCC":'联通',"CTCC":"电信"};
            	if($(this).is(':checked')){
            		$("div."+$(this).attr('id'))
            			.html('<div class="row"><div class="form-group col-md-5"><label class="control-label col-md-6">ip('+namelist[$(this).attr('id')]+') <span class="required">'+
								'* </span></label>'+
                            '<div class="col-md-6">'+
                                '<input type="text" class="form-control " name="ip-'+$(this).attr('id')+'"" />'+
                            '</div></div><div class="form-group col-md-5">'+
                            '<label class="control-label col-md-2">端口 <span class="required">'+
							'* </span> </label>'+
                            '<div class="col-md-6">'+
                                '<input type="text" class="form-control " name="port-'+$(this).attr('id')+'" />'+
                          	'</div></div>'+
                            '<div class="col-md-1"><a href="javascript:;" class="btn btn-icon-only red plus_btn"><i class="fa fa-plus"></i></a></div>'+
                            '<div class="col-md-1"><a href="javascript:;" class="btn btn-icon-only red plus_minus"><i class="fa fa-minus"></i></a></div></div>');

                    $("[name = 'ip-"+$(this).attr('id')+"']").rules("add",'required');
                    $("[name = 'ip-"+$(this).attr('id')+"']").rules("add",'ipv4');
                    $("[name = 'port-"+$(this).attr('id')+"']").rules("add",'required');
                    $("[name = 'port-"+$(this).attr('id')+"']").rules("add",'port');    	                 
                }else{
                	$("div."+$(this).attr('id')).html("");
                	$("[name = 'ip-"+$(this).attr('id')+"']").rules("remove",'required');
                    $("[name = 'ip-"+$(this).attr('id')+"']").rules("remove",'ipv4');
                    $("[name = 'port-"+$(this).attr('id')+"']").rules("remove",'required');
                    $("[name = 'port-"+$(this).attr('id')+"']").rules("remove",'port');  
                }

            });
            //验证回流带宽.清洗流量是否为0
            this.$el.on('click','.next_btn',function(e){
              if ($('.band_width .irs .irs-single').html() != '0Gb/s' && $('.clear_flow .irs .irs-single').html() != '0Gb/s') {
                  
              }else{
                // debugger
                toastr.error('回流带宽和清洗流量都不能为0！');
                return false;
              }
              e.preventDefault();
            });
            // 点击增加IP&端口配置
            this.$el.on('click','#tab2 a.plus_btn',function(){
                var type = $(this).parent().parent().parent().data().type;
                var operator = '';
                if (type == "CUCC") {
                  operator = '联通';
                }else if(type == "CMCC"){
                  operator = '移动';
                }else if(type == "CTCC"){
                  operator = '电信';
                }
                var dom_add = '<div class="row"><div class="form-group col-md-5"><label class="control-label col-md-6">ip('+operator+') <span class="required">'+
                        '* </span></label>'+
                        '<div class="col-md-6">'+
                        '<input type="text" class="form-control " name="ip-'+type+'"" />'+
                        '</div></div><div class="form-group col-md-5">'+
                        '<label class="control-label col-md-2">端口 <span class="required">'+
                        '* </span> </label>'+
                        '<div class="col-md-6">'+
                        '<input type="text" class="form-control " name="port-'+type+'" />'+
                        '</div></div>'+
                        '<div class="col-md-1"><a href="javascript:;" class="btn btn-icon-only red plus_btn"><i class="fa fa-plus"></i></a></div>'+
                        '<div class="col-md-1"><a href="javascript:;" class="btn btn-icon-only red plus_minus"><i class="fa fa-minus"></i></a></div></div>';
                $(this).parent().parent().parent().append(dom_add);
                
            });
            // 点击减号删除本条数据
            this.$el.on('click','#tab2 a.plus_minus',function(){
                var _length = $(this).parent().parent().parent().find('.row').length;
                var type_oper = $(this).parent().parent().parent().data().type;
                if (_length > 1) {
                  $(this).parent().parent().remove();
                }else{
                  $("#"+type_oper).click();
                }
                
            });

            var handleTitle = function(tab, navigation, index) {
                var total = navigation.find('li').length;
                var current = index + 1;
                // set wizard title
                $('.step-title', $('#form_wizard_1')).text('第' + (index + 1) + '步' );
                // set done steps
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
                    displayConfirm();
                } else {
                    $('#form_wizard_1').find('.button-next').show();
                    $('#form_wizard_1').find('.button-submit').hide();
                }
                Metronic.scrollTo($('.page-title'));
            }

            // default form wizard
            $('#form_wizard_1').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index, clickedIndex) {
                    return false;
                    /*
                    success.hide();
                    error.hide();
                    if (form.valid() == false) {
                        return false;
                    }
                    handleTitle(tab, navigation, clickedIndex);
                    */
                },
                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    if (form.valid() == false) {
                        return false;
                    }

                    handleTitle(tab, navigation, index);
                },
                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    handleTitle(tab, navigation, index);
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
		},
		remove: function() {
            this.$el.off();
            this.$el.empty();
           
		}
	});
	return View;
});