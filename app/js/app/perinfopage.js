define([
	'backbone',
	'common',
	'tpl/perinfopage.html',
	'toastr',
	'md5'
], function(Backbone, common, text, tpl,toastr,md5) {
	var View = Backbone.View.extend({
		el: '#page-content',
		initialize: function(router) {
			this.$el.html(tpl);
			this.attrlist = ['userName', 'email', 'address', 'phone', 'weixin', 'info', 'config_num', 'flow_num'];
			if ($.cookie('TOKEN')) {
				this.userName = $.cookie('TOKEN').user.userName ? $.cookie('TOKEN').user.userName : '';
				this.email = $.cookie('TOKEN').user.email ? $.cookie('TOKEN').user.email : '';
				this.address = $.cookie('TOKEN').user.address ? $.cookie('TOKEN').user.address : '';
				this.phone = $.cookie('TOKEN').user.telephone ? $.cookie('TOKEN').user.telephone : '';
				this.weixin = $.cookie('TOKEN').user.wechart ? $.cookie('TOKEN').user.wechart : '';
				this.info = $.cookie('TOKEN').user.remark ? $.cookie('TOKEN').user.remark : '';
				this.config_num = $.cookie('TOKEN').user.configNum ? $.cookie('TOKEN').user.configNum : '0';
				this.flow_num = $.cookie('TOKEN').user.flowNum ? $.cookie('TOKEN').user.flowNum : '0';
			}
			this.router = router;
			this.render();
		},
		render: function() {
			var view = this;
			for (var i = view.attrlist.length - 1; i >= 0; i--) {
				if (view.attrlist[i] != 'config_num' || view.attrlist[i] != 'flow_num')
					if (view[view.attrlist[i]] != "")
						$("#" + view.attrlist[i]).val(decodeURI(view[view.attrlist[i]]));
				if (view.attrlist[i] != 'userName') {
					$("." + view.attrlist[i]).html(decodeURI(view[view.attrlist[i]]));
					$(".p_" + view.attrlist[i]).html(decodeURI(view[view.attrlist[i]]));
				}
			}
			common.post(
				common.urls.getImg,{

				},
				function(data){
					if(data.status == "200"){
						$(".dropdown-user a>img").attr("src",data.photo);
						$(".profile-userpic img").attr("src",data.photo);
					}
				},
				view.router
			);
			$(".profile-usertitle-name").html(this.userName);
			// 修改个人信息点击清空
			this.$el.on('click','.reset_btn',function(e){
				$(this).parent().parent().find('input').val('');
				$(this).parent().parent().find('textarea').val('');
			});
			this.handleInfo();
			this.handlePwd();
			this.handleImg();
		},
		handleInfo: function() {
			var view = this;
			$('.info-form').validate({
				errorElement: 'span', //default input error message container
				errorClass: 'help-block', // default input error message class
				focusInvalid: true, // do not focus the last invalid input
				rules: {
					userName: {
						required: true,
						rangelength: [6, 25],
						lter_and_num: true,
					},
					phone: {
						required: true,
						mobileZH: true,
					},
					weixin: {
						required: false
					},
					email: {
						required: true,
						email: true
					},
					// address: {
					// 	required: false
					// },
					info: {
						required: false
					}
				},

				messages: {
					userName: {
						required: "请填写用户名."
					}
				},

				// invalidHandler: function(event, validator) { //display error alert on form submit 
				//     $('.alert-danger', $('.login-form')).show();
				// },

				highlight: function(element) { // hightlight error inputs
					$(element)
						.closest('.form-group').removeClass("has-info has-error has-success").addClass('has-error'); // set error class to the control group
				},

				success: function(label) {
					label.closest('.form-group').removeClass('has-error').addClass('has-success');
					//label.remove();
				},
				submitHandler: function(form) {
					common.post(
						common.urls.updateUser, {
							"phone": $("#phone").val(),
							"userName": $("#userName").val(),
							"weiChat": encodeURI($("#weixin").val()),
							"email": $("#email").val(),
							// "address": encodeURI($("#address").val()),
							"remark": encodeURI($("#info").val())
						},
						function(data) {
							if (data.status == "200") {
								$.removeCookie('TOKEN');
								data.user.userName = data.user.username;
								data.user.photo = '';
								$.cookie('TOKEN', data, { expires: 7 });
								// view.router.navigate("login", {trigger: true});
								$(".dropdown-user .username").html($.cookie('TOKEN').user.userName);
								toastr.success(data.message);
								// for (var i = view.attrlist.length - 1; i >= 0; i--) {
								// 	if (view.attrlist[i] != 'config_num' || view.attrlist[i] != 'flow_num' || view.attrlist[i] != 'userName') {
								// 		if(view.attrlist[i] == 'weixin'||view.attrlist[i] == 'address'||view.attrlist[i] == 'remark')
								// 			$(".p_" + view.attrlist[i]).html(decodeURI($("#" + view.attrlist[i]).val()));
								// 		else
								// 			$(".p_" + view.attrlist[i]).html($("#" + view.attrlist[i]).val());
								// 	}
								// }
								// $(".profile-usertitle-name").html($("#userName").val());
							}else{
								toastr.error(data.message);
							}
						},
						view.router
					);
				}
			});
		},
		handlePwd: function() {
			var view = this;
			$('.psw-form').validate({
				errorElement: 'span', //default input error message container
				errorClass: 'help-block', // default input error message class
				focusInvalid: true, // do not focus the last invalid input
				rules: {
					old_psw: {
						required: true,
						rangelength: [8, 25]
					},
					new_psw: {
						required: true,
						rangelength: [8, 25]
					},
					re_new_psw: {
						required: true,
						rangelength: [8, 25],
						equalTo: "#new_psw"
					}
				},

				messages: { // custom messages for radio buttons and checkboxes
					old_psw: {
						required: "请输入正确格式的密码."
					},
					old_psw: {
						required: "请输入正确格式的新密码."
					},
					re_new_psw: {
						required: "请再次输入正确格式的新密码."
					}
				},

				highlight: function(element) { // hightlight error inputs
					$(element)
						.closest('.form-group').removeClass("has-info has-error has-success").addClass('has-error'); // set error class to the control group
				},

				success: function(label) {
					label.closest('.form-group').removeClass('has-error').addClass('has-success');
					//label.remove();
				},
				submitHandler: function(form) {
					common.post(
						common.urls.updatePwd, {
							"passWord": md5($("#old_psw").val()),
							"passWord1": md5($("#new_psw").val()),
						},
						function(data) {
							if (data.status == "200") {
								toastr.success(data.message);
								$.removeCookie('TOKEN');
								view.router.navigate("login", {trigger: true});
							}else{
								toastr.error(data.message);
							}
						},
						view.router
					);
				}
			});
		},
		handleImg: function() {
			var view = this;
			$('.img-form').validate({
				errorElement: 'span', //default input error message container
				errorClass: 'help-block', // default input error message class
				focusInvalid: true, // do not focus the last invalid input
				rules: {
					file: {
		                required: true,
		                accept:true,
		                extension:true
		            }
				},

				messages: { // custom messages for radio buttons and checkboxes
 					required: "请上传图片"
				},

				highlight: function(element) { // hightlight error inputs
					$(element)
						.closest('.form-group').removeClass("has-info has-error has-success").addClass('has-error'); // set error class to the control group
				},

				success: function(label) {
					label.closest('.form-group').removeClass('has-error').addClass('has-success');
				},
				submitHandler: function(form) {
				// this.$el.on("click","#submit2",function(e){
					var data = new FormData();
					$.each($('#file')[0].files, function(i, file) {
						data.append('imageFile', file);
						data.append('token', $.cookie("TOKEN").token);
					});
					$.ajax({
						url: common.urls.updateImage,
						type: 'post',
						data: data,
						cache: false,
						async: true,
						contentType: false, //不可缺
						processData: false, //不可缺
						success: function(data) {
							if (data.status == "200") {
								toastr.success(data.message);
								$(".profile-userpic img").attr("src",data.photo);
								$('.dropdown-user .dropdown-toggle img').attr("src",data.photo);
							}else if(data.status == "500"){
								common.layout(view.router);
							}else{
								toastr.error(data.message);
							}
						}
					});
				//});
				}
			});
			 //});
		},
		remove: function() {
			this.$el.off();
			this.$el.empty();
		}
	});
	return View;
});