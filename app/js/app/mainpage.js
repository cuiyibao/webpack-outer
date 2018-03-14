define([
	'backbone',
	'common',
	'metronic',
	'layout',
	'demo',
	'quickSidebar',
	'scrollTo',
	'tpl/mainpage.html',
	'pace',
	'toastr'
], function(Backbone,common,Metronic,Layout,Demo, QuickSidebar,scrollTo,tpl,pace,toastr) {
	var View = Backbone.View.extend({
		el: '#layout',
		initialize: function(router) {
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
			this.$el.html(tpl);
			this.render();
			$("#header_notification_bar>a>span.badge-default").hide();
			if ($('body .page-sidebar-menu').hasClass('page-sidebar-menu-closed')) {

			}else{
				$('body .page-sidebar-menu').addClass('page-sidebar-menu-closed');
			}
			this.notRead =[];
			this.isRead =[];
			this.router = router;

		},
		render: function() {
			var view = this;
			Metronic.init();
			Layout.init();
			QuickSidebar.init();
			Demo.init();

			if($.cookie('TOKEN')){
				///TODO messgae images
				$(".dropdown-user .username").html($.cookie('TOKEN').user.userName);
				common.post(
					common.urls.getImg,{

					},
					function(data){
						if(data.status == "200")
							$(".dropdown-user a>img").attr("src",data.photo);
					},
					view.router
				);
				$(".dropdown-user a>img").attr("src",$.cookie('TOKEN').user.photo);
				if($.cookie("TOKEN")!=undefined&&$.cookie("TOKEN").token!=undefined){
					function websocket(view){
						var token =$.cookie("TOKEN").token;
						var ws = new WebSocket(common.urls.websocket);
						ws.onopen = function(evt) {
							console.log("Connection open ...");
							clearInterval(window.timeTask);
							ws.send(token);
						};
						window.ws = view.ws =ws;
						ws.onmessage = function(evt) {
							var data =eval('(' +evt.data+')');
							var html ="";

							if(data!=null){
								if(data.length>0){
									$.each(data,function(i,e){
										view.notRead.push(e.id);
										if(e.type==2){
											html+='<li>'+
												'<a href="javascript:;">'+
												'<span class="time">'+common.getFormatDate(new Date(e.time))+'</span>'+
												'<span class="details">'+
												'<span class="label label-sm label-icon label-success">'+
												'<i class="fa fa-plus"></i>'+
												'</span>'+
												e.message+'</span>'+
												'</a>'+
												'</li>';
										}else{
											html+='<li>'+
												'<a href="javascript:;">'+
												'<span class="time">'+common.getFormatDate(new Date(e.time))+'</span>'+
												'<span class="details">'+
												'<span class="label label-sm label-icon label-danger">'+
												'<i class="fa fa-bolt"></i>'+
												'</span>'+
												e.message+'</span>'+
												'</a>'+
												'</li>';
										}
									});
									if(view.notRead.length>0){
										$("#header_notification_bar>a>span.badge-default").html(view.notRead.length);
										$("#header_notification_bar>a>span.badge-default").show();
									}else{
										$("#header_notification_bar>a>span.badge-default").hide();
									}
									$("#header_notification_bar .slimScrollDiv>ul").prepend(html);
								}
								try{
									ws.send("#");
								}catch(e){
									console.log("websocket 链接异常");
								}
							}else{
								try{
									ws.send("#");
								}catch(e){
									console.log("websocket 链接异常");
								}
							}
						};

						ws.onclose = function(evt) {
							console.log("Connection closed.");
							var timeTask = function (a) {
								try{
									websocket(view);
								}catch(e){
									console.log("websocket 链接异常");
									a ++;
									if(a <= 10){timeTask(a);}
								}
							};
							timeTask(0);
							// window.timeTaskCount = 0;
							// window.timeTask = setInterval(function () {
							// 	try{
							// 		websocket(view);
							// 		clearInterval(window.timeTask);
							// 	}catch(e){
							// 		if(window.timeTaskCount == 10){
							// 			clearInterval(window.timeTask);
							// 		}
							// 		console.log("websocket 链接异常");
							// 		window.timeTaskCount++;
							// 	}
							// },1000);
						};
					}
					// window.timeTaskCount = 0;
					var timeTask = function (a) {
						try{
							websocket(view);
						}catch(e){
							console.log("websocket 链接异常");
							a++;
							if(a <= 10){timeTask(a);}
						}
					};
					timeTask(0);
					// window.timeTask = setInterval(function () {
					// 	try{
					// 		websocket(view);
					// 		clearInterval(window.timeTask);
					// 	}catch(e){
					// 		if(window.timeTaskCount == 10){
					// 			clearInterval(window.timeTask);
					// 		}
					// 		console.log("websocket 链接异常");
					// 		window.timeTaskCount++;
					// 	}
					// },1000);
				}else{
					common.layout(this.router);
				}
			}
			this.$el.on("click","#logout",function(e){
				$.removeCookie('TOKEN');
				$.removeCookie('cokenttt');
				toastr.success("已登出");
            });
			this.$el.on('shown.bs.dropdown','#header_notification_bar',function showDropdown() {
				view.isRead.unshift.apply( view.isRead, view.notRead );
				view.notRead = [];
				$(".external h3 span").html(view.isRead.length);
				$("#header_notification_bar>a>span.badge-default").hide();
				var msg="id:";
				for(var i=0;i<view.isRead.length;i++){
					msg+=view.isRead[i]+",";
				}
				try{
					view.ws.send(msg);
				}catch(e){
					console.log("websocket 链接异常");
				}
			});
		},
		remove:function(){
			$('body').off('click');
			if(this.ws){
				this.ws.onclose = null;
				this.ws.close();
			}
			this.$el.off();
			this.$el.empty();

			//Metronic.remove();
		}
	});
	return View;
});