define([
	'backbone',
	'common',
	'tpl/indexpage.html',
	'flot',
    'flotResize',
    'flotCategories',
    'flotTime'
], function(Backbone, common, text,tpl) {
	var View = Backbone.View.extend({
		el: '#page-content',
		initialize: function(router) {
            this.$el.html(tpl);
            this.router = router;
			this.render();
		},
		render: function() {	

            var view = this;
            common.post(
                common.urls.selectAllHome,{
                },
                function(data){
                    if(data.status=="200"){
                        view.initCharts(data.flowAttack.hour,'hour');
                        var startTime = common.getFormatDate(new Date(data.flowAttack.hour[0][0]));
                        var endTime = common.getFormatDate(new Date(data.flowAttack.hour[data.flowAttack.hour.length-1][0]));
                        view.data = data.flowAttack;
                        $(".caption-helper").html(startTime+"-"+endTime);
                        $(".blue-madison .number").html(data.flowAll+"G");
                        $(".red-intense .number").html(data.flowFilter+"G");
                        $(".green-haze .number").html(data.packetAll+"个");
                        var listhtml="",tabhtml="";
                        var state = [
                            '<span class="label label-warning">准备中 </span>',
                            '<span class="label label-success">准备就绪 </span>',
                            '<span class="label label-info">正常运转 </span>',
                            '<span class="label label-danger">异常 </span>',
                        ];
                        var web = [
                            'web服务',
                            '非web服务'
                        ];
                        $.each(data.data,function(i,e){
                          
                            // if(i==0){
                            //     var classname ='active';
                            // }else
                            //     var classname ='';
                            listhtml += '<li>'+
                                            '<a href="#tab_15_'+(i+1)+'" data-toggle="tab" aria-expanded="true">配置 '+(i+1)+'</a>'+
                                        '</li>';
                            tabhtml += '<div class="tab-pane" id="tab_15_'+(i+1)+'">'+
                                            '<div class="portlet-body">'+
                                                '<div class="row static-info">'+
                                                    '<div class="col-md-2 name">配置ID</div><div class="col-md-4 value">'+e.id+'</div>'+
                                                    '<div class="col-md-2 name">应用类别</div><div class="col-md-4 value">'+web[e.web]+'</div>'+
                                                '</div>'+
                                                '<div class="row static-info">'+
                                                    '<div class="col-md-2 name">协议类型</div><div class="col-md-4 value">'+e.protocol+'</div>'+
                                                    '<div class="col-md-2 name">配置时间</div><div class="col-md-4 value">'+e.conftime+'</div>'+
                                                '</div>'+
                                                '<div class="row static-info">'+
                                                    '<div class="col-md-2 name">当前状态</div><div class="col-md-4 value">'+state[e.confstate]+'</div>'+
                                                    '<div class="col-md-2 name">回流带宽</div><div class="col-md-4 value">'+e.returnbandwidth+'</div>'+
                                                '</div>'+
                                                '<div class="row static-info">'+
                                                    '<div class="col-md-2 name">总流量</div><div class="col-md-4 value">'+e.flowAll+'Gb</div>'+
                                                    '<div class="col-md-2 name">清洗总量</div><div class="col-md-4 value">'+e.flowFilter+'Gb</div>'+
                                                '</div>'+
                                                '<div class="row static-info">'+
                                                    '<div class="col-md-2 name">总包数</div><div class="col-md-4 value">'+e.packetAll+'个</div>'+
                                                    '<div class="col-md-2 name">清洗包数</div><div class="col-md-4 value">'+e.packetFilter+'个</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        });
                        $(".tabbable-line ul").html(listhtml);
                        $(".tabbable-line .tab-content").html(tabhtml);
                        $('.tabbable-line ul a:first').tab('show');
                    }else{
                        //TODO
                    }
                },
                view.router
            );
            this.$el.on("change","[name='options']:checked",function(e){
                var id = $(this).data("id");
                view.initCharts(view.data[id],id);
                var startTime = common.getFormatDate(new Date(view.data[id][0][0]));
                var endTime = common.getFormatDate(new Date(view.data[id][view.data[id].length-1][0]));
                $(".caption-helper").html(startTime+"-"+endTime);
            });
		},
		initCharts: function (data,id) {
            if (!jQuery.plot) {
                return;
            }

            function showChartTooltip(x, y, xValue, yValue) {
                $('<div id="tooltip" class="chart-tooltip">' +xValue+":<br/>"+ yValue + '<\/div>').css({
                    position: 'absolute',
                    display: 'none',
                    top: y - 40,
                    left: x - 40,
                    border: '0px solid #ccc',
                    padding: '2px 6px',
                    'background-color': '#fff'
                }).appendTo("body").fadeIn(200);
            }

            // var data = [];
            var totalPoints = 250;

            // random data generator for plot charts

            function getRandomData() {
                if (data.length > 0) data = data.slice(1);
                // do a random walk
                while (data.length < totalPoints) {
                    var prev = data.length > 0 ? data[data.length - 1] : 50;
                    var y = prev + Math.random() * 10 - 5;
                    if (y < 0) y = 0;
                    if (y > 100) y = 100;
                    data.push(y);
                }
                // zip the generated y values with the x values
                var res = [];
                for (var i = 0; i < data.length; ++i) res.push([i, data[i]])
                return res;
            }

            function randValue() {
                return (Math.floor(Math.random() * (1 + 50 - 20))) + 10;
            }
            var visitors = [];
            $.extend(true,visitors,data);
            $.each(visitors,function (i,e) {
                visitors[i][0] = common.getFormatDate3(new Date(e[0]));
                if(id != 'hour'){
                    visitors[i][0] = visitors[i][0].substring(0,visitors[i][0].length - 2);
                }
            });
            if ($('#site_statistics').length != 0) {

                $('#site_statistics_loading').hide();
                $('#site_statistics_content').show();

                var plot_statistics = $.plot($("#site_statistics"),
                    [{
                        data: visitors,
                        lines: {
                            fill: 0.6,
                            lineWidth: 0
                        },
                        color: ['#f89f9f']
                    }, {
                        data: visitors,
                        points: {
                            show: true,
                            fill: true,
                            radius: 5,
                            fillColor: "#f89f9f",
                            lineWidth: 3
                        },
                        color: '#fff',
                        shadowSize: 0
                    }],

                    {
                        xaxis: {
                            tickLength: 0,
                            tickDecimals: 0,
                            mode: "categories",
                            min: 0,
                            font: {
                                lineHeight: 14,
                                style: "normal",
                                variant: "small-caps",
                                color: "#6F7B8A"
                            }
                        },
                        // xaxis: {
                        //     tickLength: 0,
                        //     tickDecimals: 0,
                        //     mode: "time",
                        //     timezone:'browser',
                        //     min: data[0][0],
                        //     max: data[data.length-1][0],
                        //     font: {
                        //         lineHeight: 14,
                        //         style: "normal",
                        //         variant: "small-caps",
                        //         color: "#6F7B8A"
                        //     }
                        // },
                        yaxis: {
                            ticks: 5,
                            tickDecimals: 0,
                            tickColor: "#eee",
                            min: 0,
                            font: {
                                lineHeight: 14,
                                style: "normal",
                                variant: "small-caps",
                                color: "#6F7B8A"
                            }
                        },
                        grid: {
                            hoverable: true,
                            clickable: true,
                            tickColor: "#eee",
                            borderColor: "#eee",
                            borderWidth: 1
                        }
                    });

                var previousPoint = null;
                $("#site_statistics").bind("plothover", function (event, pos, item) {
                    $("#x").text(pos.x.toFixed(2));
                    $("#y").text(pos.y.toFixed(2));
                    if (item) {
                        if (previousPoint != item.dataIndex) {
                            previousPoint = item.dataIndex;

                            $("#tooltip").remove();
                            var x = item.datapoint[0].toFixed(2),
                                y = item.datapoint[1].toFixed(2);

                            showChartTooltip(item.pageX, item.pageY, common.getFormatDate(new Date(item.datapoint[0])), item.datapoint[1] + ' Gb');
                        }
                    } else {
                        $("#tooltip").remove();
                        previousPoint = null;
                    }
                });
            }
        },
		remove: function() {
            this.$el.off();
            this.$el.empty();
            $("#site_statistics").unbind("plothover");
		}
	});
	return View;
});