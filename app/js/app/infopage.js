define([
	'backbone',
	'common',
	'tpl/infopage.html',
	'datatimepicker',
	'toastr'
], function(Backbone, common,tpl,datatimepicker,toastr) {
	var View = Backbone.View.extend({
		el: '#page-content',
		initialize: function(router) {
            	this.$el.html(tpl);
            	this.router = router;
		this.render();
	},	
	render: function() {
		var view = this;	
		$.fn.datetimepicker.dates['zh-CN'] = {
	            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
	            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
	            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
	            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
	            months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
	            today: "今天",
	            suffix: [],
	            meridiem: ["上午", "下午"]
	       };
		$(".datatime_picker").datetimepicker({
	            language: 'zh-CN',
	            format: 'yyyy-MM-dd',
	            autoclose: true,
	            minView:'month',
	            todayBtn: 1,
	            todayHighlight: 1,
	            forceParse: 1,
	            Remove: true
	       });
		searchTable();
	       function searchTable(){
			this.table = common.initTable(
				"#table",
				common.urls.select,
				[{ 
					"searchable":false,
					"orderable":false,
					"render": function ( data, type, full, meta ) {
	     					 return meta.row+1;
	    				}
				},
				{ "data": "time","title":'时间'  },
				{ "data": "message" ,"title":'消息内容' },
		           	{
	    				"title":'操作',
	    				"searchable":false,
					"orderable":false,
	  				"render": function ( data, type, full, meta ) {
	  					return '<a href="javascript:;" data-id='+full['id']+' class="c-delete btn default btn-xs red"><i class="fa fa-share"></i> 删除 </a>';
	  				}
	    			}],
	    			function(d){
	    				d.token = $.cookie('TOKEN').token;
	    				d.message = $('#info_message').val();
	    				d.starttime = $('#start_time').val();
	    				d.endtime = $('#end_time').val();
	    			},
	    			view.router
	    		);
		}
		// 查询
		this.$el.on("click",".form-horizontal button[type='submit']",function(e){
			searchTable();
			e.preventDefault();
		});
		//重置
		this.$el.on("click",".form-horizontal button[type='button']",function(e){
			$('#info_message').val('');
			$('#start_time').val("");
			$('#end_time').val("");
			searchTable();
			e.preventDefault();
		});	
    		this.$el.on("click","[class*='c-']",function(){
    			var id = $(this).data("id");
    			$.ajax({
    				url: common.urls.delete,
    				type: "post",
    				dataType: "json",
    				data:{
    					id: id
    				},
    				success: function(data){
    					if (data.status == "200") {
						toastr.success(data.message);
						searchTable();
					}else{
						toastr.error(data.message);
					}
    				},
    				error: function(data){
    					toastr.error('服务器请求错误');
    				}
    			});
   			//  $.post(
			// 	common.urls.delete, {
			// 		"id": id,
			// 	},
			// 	function(data) {
			// 		if (data.status == "200") {
			// 			toastr.success(data.message);
			// 		}else{
			// 			toastr.error(data.message);
			// 		}
			// 	},
			// 	view.router
			// );
    		});
	},
	remove: function() {
		this.$el.off();
		this.$el.empty();
		
	}
	});
	return View;
});