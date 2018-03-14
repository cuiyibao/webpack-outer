define([
	'backbone',
	'common',
	'tpl/login.html',
	'bootstrap',
	'validation',
	'blockui',
	'md5',
	'toastr',
	'additional_methods',
	'validation_zh',
	'idcode',
	'codevali'
], function(Backbone, common,tpl,bootstrap,validation,Blockui,md5,toastr,additional_methods,validation_zh,idcode,codevali) {
	var View = Backbone.View.extend({
		el: '#layout',
		initialize: function(router) {
			this.router=router;
			this.$el.html(tpl);
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
		},	
		render: function() {
			if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
		          	$('input:not(input[type=submit])').each(function(){
			              var outHtml = this.outerHTML;
			              $(this).append(outHtml);
		          	});
		  	}
		  	$('#username').val(localStorage.getItem('outerUser'));
			$('#password').val(localStorage.getItem('outerPassword'));
			if(localStorage.getItem('outerPassword')){$('input[name="remember"]').prop('checked',true)};
			this.handleLogin();
			this.handleForgetPassword();
			this.handleRegister();
			
		},
		handleLogin : function() {
			var view = this;
	        $('.login-form').validate({
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: true, // do not focus the last invalid input
	            rules: {
	                username: {
	                    required: true,
	                    rangelength: [6,25],
	                    lter_and_num:true,
	                },
	                password: {
	                    required: true,
	                    rangelength: [8,25],
						password_regular:true,
	                },
	                remember: {
	                    required: false
	                }
	            },
	            messages: {
	                username: {
	                    required: "请填写用户名."
	                },
	                password: {
	                    required: "请输入密码."
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
	            	var isCode = $.valicode.validateCode(); 
					if (isCode == false) {
						toastr.error('验证码输入错误，请重新输入！');
						return;
					}else{
						$('#myModal_gif').show();
						$.post(
							common.urls.login,{
								"userName":$("#username").val(),
								"passWord":md5($("#password").val()),
							},function(data,status,xhr){
								if(data.status=="200"){
									$.cookie('TOKEN', data, { expires: 7 });
										$('#myModal_gif').hide();
										localStorage.setItem('outerUser',$('#username').val());
									if($('input[name="remember"]').is(':checked')){
										localStorage.setItem('outerPassword',$('#password').val());
									}else {
										localStorage.removeItem('outerPassword');
									}
									view.router.navigate("index", {trigger: true});
									toastr.success("登陆成功");
								}else{
									$('#myModal_gif').hide();
									toastr.error(data.message);
								}
							}
						);
					}
	            }
	        });

	        $('.login-form input').keypress(function(e) {
	            if (e.which == 13) {
	                if ($('.login-form').validate().form()) {
	                	$('.login-form').submit();
	                    view.router.navigate("main", {trigger: true});
	                }
	                return false;
	            }
	        });
	    },
	    handleForgetPassword : function() {
	      //   $('.forget-form').validate({
	      //       errorElement: 'span', //default input error message container
	      //       errorClass: 'help-block', // default input error message class
	      //       focusInvalid: false, // do not focus the last invalid input
	      //       ignore: "",
	      //       rules: {
	      //           email: {
	      //               required: true,
	      //               email: true
	      //           }
	      //       },

	      //       messages: {
	      //           email: {
	      //               required: "Email is required."
	      //           }
	      //       },

	      //       invalidHandler: function(event, validator) { //display error alert on form submit   

	      //       },

	      //       highlight: function(element) { // hightlight error inputs
	      //           $(element)
	      //               .closest('.form-group').addClass('has-error'); // set error class to the control group
	      //       },

	      //       success: function(label) {
	      //           label.closest('.form-group').removeClass('has-error');
	      //           label.remove();
	      //       },

	      //       errorPlacement: function(error, element) {
	      //           error.insertAfter(element.closest('.input-icon'));
	      //       },

	      //       submitHandler: function(form) {
	      //           $.post(
	      //    			common.urls.register,{
	      //    				"user.userName":$("#username").val(),
	      //    				"user.passWord":md5($("#password").val()),
	      //    				"user.email":$("#email").val(),
	      //    				"t":new Date().getTime()
	      //    			},
	      //    			function(data){
	      //    				if(data.status="200"){
	      //    					$.cookie('TOKEN', data, { expires: 7 });
							// 	view.router.navigate("index", {trigger: true});
							// }
	      //    			}
	      //    		);
	      //       }
	      //   });

	      //   $('.forget-form input').keypress(function(e) {
	      //       if (e.which == 13) {
	      //           if ($('.forget-form').validate().form()) {
	      //               $('.forget-form').submit();
	      //           }
	      //           return false;
	      //       }
	      //   });

	        jQuery('#forget-password').click(function() {
	            jQuery('.login-form').hide();
	            jQuery('.forget-form').show();
	        });

	        jQuery('#back-btn').click(function() {
	            jQuery('.login-form').show();
	            jQuery('.forget-form').hide();
	        });
	    },
   		handleRegister : function() {
   			var view = this;
	        $('.register-form').validate({
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: true, // do not focus the last invalid input
	            rules: {
	                username: {
	                    required: true,
	                    rangelength: [6,25],
	                    lter_and_num:true,
	                },
	                password: {
	                    required: true,
	                    rangelength: [8,25],
						password_regular:true,
	                },
	                rpassword: {
	                    equalTo: "#register_password"
	                },
	                email: {
	                    required: true,
	                    email: true
	                },
	                tnc:{
	                	required: true,
	                }
	            },

	            messages: { // custom messages for radio buttons and checkboxes
	                username: {
	                    required: "请输入用户名"
	                },
	                password: {
	                    required: "请输入密码"
	                },

	                email: {
	                    required: "请输入邮箱地址"
	                },
	                tnc:{
	                	required: "请同意服务协议",
	                }
	            },

	            invalidHandler: function(event, validator) { //display error alert on form submit   

	            },

				highlight: function(element) { // hightlight error inputs
					$(element)
						.closest('.form-group').removeClass("has-info has-error has-success").addClass('has-error'); // set error class to the control group
				},
				success: function(label) {
					label.closest('.form-group').removeClass('has-error').addClass('has-success');
					label.remove();
				},
				errorPlacement: function(error, element) {
					if (element.attr("name") == "tnc") { // insert checkbox errors after the container
						error.insertAfter($('#register_tnc_error'));
					} else if (element.closest('.input-icon').length === 1) {
						error.insertAfter(element.closest('.input-icon'));
					} else {
						error.insertAfter(element);
					}
				},
	            submitHandler: function(form) {
	            	var IsBy = $.idcode.validateCode(); 
					if (IsBy == false) {
						toastr.error('验证码输入错误，请重新输入！');
						return;
					}else{
						$('#myModal_gif').modal('show');
						$.post(
							common.urls.register,{
								"userName":$("#register_username").val(),
								"passWord":md5($("#register_password").val()),
								"email":$("#register_email").val()
							},function(data){
								if(data.status=="200"){
									$('#myModal_gif').modal('hide');

									$.cookie('TOKEN', data, { expires: 7 });
									toastr.success("注册成功");
									// view.router.navigate("index", {trigger: true});
									$('.login-form').show();
									$('.register-form').hide();
								}else{
									$('#myModal_gif').modal('hide');
									toastr.error(data.message);
								}
							}
						);
	     			}
	            }
	        });

	        // this.$el.on('keypress','.register-form input',function(e) {
	        //     if (e.which == 13) {
	        //         if ($('.register-form').validate().form()) {
	        //             $('.register-form').submit();
	        //         }
	        //         return false;
	        //     }
	        // });
	        this.$el.on('click','#register-btn',function() {
	        	$('.register-form input').val('');
	            $('.login-form').hide();
	            $('.register-form').show();
	        });

	        this.$el.on('click','#register-back-btn',function() {
	            $('.login-form').show();
	            $('.register-form').hide();
	        });
	    },
		remove: function() {
			this.$el.off();
			this.$el.empty();
			
		}
	});
	return View;
});