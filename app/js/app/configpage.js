define([
	'backbone',
	'datatimepicker',
	'common',
	'datatables',
	'tpl/configpage.html',
	'toastr',
    'tableTools',
    'scroller',
    'dataTables_bootstrap'
], function(Backbone, datatimepicker,common,datatables,tpl,toastr) {
	var View = Backbone.View.extend({
		el: '#page-content',
		initialize: function(router) {
			this.$el.html(tpl);
			this.router= router;
			this.render();
		},	
		render: function() {
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
			var view = this;
			searchTable();
			function searchTable(){
				this.table = common.initTable(
					"#table",
					common.urls.selectAll,
					[{
						"searchable":false,
						"orderable":false,
						"render": function ( data, type, full, meta ) {
								return meta.row+1;
							}
					},
					{ "data": "conftime","title":'时间'  },
					{ "data": "returnbandwidth" ,"title":'带宽' },
					{ "data": "protocol","title":'协议'  },{
						"data": "web" ,
						"title":'web',
						"searchable":false,
						"orderable":false,
						"render": function ( data, type, full, meta ) {
							 return data=='0'?"web":"非web";
						}
					},
					{ "data": "cleanflow" ,"title":'流量' },{
						"data": "confcontent" ,
						"title":'内容',
						"searchable":false,
						"render": function ( data, type, full, meta ) {

							var name = {"CMCC":" 移动","CTCC":"电信",'CUCC':'联通'};
							var data = eval('(' + data + ')');
							var html="";
							$.each(data,function(i,e){
								html+=name[e.isp]+" : "+e.ip+':'+e.port;
							});
							return html;
						}
					},{
						"data": "confstate" ,
						"title":'状态' ,
						"searchable":false,
						"orderable":false,
						"render": function ( data, type, full, meta ){
							var state = [
								'<span class="label label-warning">准备中 </span>',
								'<span class="label label-success">准备就绪 </span>',
								'<span class="label label-info">正常运转 </span>',
								'<span class="label label-danger">异常 </span>',
							];
							return state[parseInt(data)];
						}
					},{
						"data":"appkey",
						"title":'appkey下载',
						"orderable":false,
						"render": function ( data, type, full, meta ) {
							if(full['appkey']==null){
								return "<span class= 'label label-sm label-danger'>未授权</span>"
							}else{
								return '<a href="'+common.urls.download+full['appkey']+'" data-id='+full['id']+' class="btn default btn-xs green"><i class="fa fa-file"></i> 下载 </a>';
							}
						}

					},{
						"title":'操作',
						"searchable":false,
						"orderable":false,
						"render": function ( data, type, full, meta ) {
							if(full.confstate == 0){
								return '<a href="javascript:;" data-id='+full['id']+' class="c-delete btn default btn-xs red"><i class="fa fa-share"></i> 删除 </a>';
							}else if(full.confstate == 1){
								return '<a href="javascript:;" data-id='+full['id']+' class="c-delete btn default btn-xs red"><i class="fa fa-share"></i> 删除 </a>'+
								'<a href="javascript:;"  data-id='+full['id']+' class="c-start btn default btn-xs blue"><i class="fa fa-share"></i> 启动 </a>';
							}else if(full.confstate == 2){
								return '<a href="javascript:;" data-id='+full['id']+' class="c-delete btn default btn-xs red"><i class="fa fa-share"></i> 删除 </a>'+
								'<a href="javascript:;" data-id='+full['id']+' class="c-stop btn default btn-xs yellow"><i class="fa fa-share"></i> 关闭 </a>';
							}else if(full.confstate == 3){
								return '<a href="javascript:;" data-id='+full['id']+' class="c-delete btn default btn-xs red"><i class="fa fa-share"></i> 删除 </a>'+
								'<a href="javascript:;"  data-id='+full['id']+' class="c-confirm btn default btn-xs blue"><i class="fa fa-share"></i> 检测 </a>';
							}
						}
					}],
					function(d){
						d.token = $.cookie('TOKEN').token;
						d.protocol = $('#protocol').val();
						d.web = $('#isweb').val();
						d.confstate = $('#state').val();
						d.starttime = $('#startTime').val();
						d.endtime = $('#endTime').val();
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
				$('#protocol').val('');
				$('#isweb').val("");
				$('#state').val("");
				$('#startTime').val("");
				$('#endTime').val("");
				searchTable();
				e.preventDefault();
			});
    		this.$el.on("click","[class*='c-']",function(){
				var type = '',msg = '';
    			if($(this).hasClass("c-delete")){
    				type = 'delete';msg = '删除';
    			}else if($(this).hasClass("c-start")){
    				type = 'start';msg = '启动';
    			}else if($(this).hasClass("c-stop")){
    				type = 'stop';msg = '暂停';
    			}else if($(this).hasClass("c-confirm")){
    				type = 'confirm';msg = '检测';
    			}
    			var id = $(this).data("id");
				common.confirm('是否确认'+msg+'该服务',function () {
					common.post(
						common.urls.operation, {
							"id": id,
							"type": type
						},
						function(data) {
							if (data.status == "200") {
								toastr.success(data.message);
								searchTable();
								// view.table.ajax.reload();
							}else{
								toastr.error(data.message);
							}
						},
						view.router
					);
				})
    		});
		},
		remove: function() {
			this.$el.off();
			this.$el.empty();
		}
	});
	return View;
});