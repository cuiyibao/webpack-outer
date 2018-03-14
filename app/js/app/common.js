define(["toastr",'metronic'],function(toastr,Metronic){
    // var ip="http://172.16.8.54:8080";
    // var ip="http://172.16.8.61:8080";
    var ip="";
    var json = './json';
    var sysName="/dshield-outer-system/userInfo";
    var sysConfig = '/dshield-outer-system/ConfigController';
    var sysNotice = '/dshield-outer-system/notice';
    var resource = '/dshield-outer-system/resource';
    var business = '/dshield-outer-system/business';
    var rule = '/dshield-outer-system/rule';
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
	var url={
        ip:ip,
        urls:{
            login:ip+sysName+"/login",
            register:ip+sysName+"/register",
            updateUser:ip+sysName+"/updateUser",
            updateImage:ip+sysName+"/updateImage",
            updatePwd:ip+sysName+'/updatePwd',
            select:ip+sysNotice+'/select',
            delete:ip+sysNotice+'/delete',

            selectAll:ip+sysConfig+'/selectAll',
            selectAllHome:ip+sysConfig+'/selectAllHome',
            insert:ip+sysConfig+'/insert',
            operation:ip+sysConfig+'/operation', 
            download:ip+sysConfig+'/downloadFile?path=',
            getImg:ip+sysName+'/getImg',

            //新增模块
            resourceSelect:ip+resource+'/selectAllResource',
            resourceInsert:ip+resource+'/insertResource',
            resourceUpdate:ip+resource+'/updateResource',
            businessSelect:ip+business+'/selectAllBusiness',
            businessInsert:ip+business+'/insertBusiness',
            businessDelete:ip+business+'/deleteBusinessById',
            businessUpdate:ip+business+'/updateBusinessName',
            ruleSelect:ip+rule+'/selectAllRule',
            ruleInsert:ip+rule+'/insertRule',
            ruleDelete:ip+rule+'/deleteRuleById',
            ruleUpdate:ip+rule+'/updateRule',
            selectByUserId:ip+'/dshield-outer-system/rinse'+'/selectByUserId',

            // websocket:"ws://172.16.8.61:8080/dshield-outer-system/websocket/chat"
            websocket:"ws://183.134.63.130:60666/dshield-outer-system/websocket/chat"
        },

       // urls:{
       //      selectAllHome:json+'/selectAllHome.json',
       //      selectAll:json+"/config.json",
       //      login:json+"/login.json",
       //      register:json+"/register.json",
       //      updateUser:json+"/updateUser.json",
       //      updateImage:json+"/updateImage.json",
       //      updatePwd:json+'/updatePwd.json',
       //      select:json+'/select.json',
       //      delete:json+'/delete.json', 
       //      operation:json+'/operation.json', 
       //  },
        post:function(url,data,callback,router){
            var view = this;
            data['token'] = $.cookie("TOKEN")!=undefined?$.cookie("TOKEN").token:"";
            data["t"]=new Date().getTime();
            $.post(
                url,
                data, 
                function(data){
                    if(data.status=="500"){
                        view.logout(router);
                    }else{
                        callback(data);
                    }
                }
            );
        },
        getFormatDate:function(time) {
            var date = time;
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (hour >= 0 && hour <= 9) {
                hour = "0" + hour;
            }
            if (minute >= 0 && minute <= 9) {
                minute = "0" + minute;
            }
            if (second >= 0 && second <= 9) {
                second = "0" + second;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + 
            " " + hour + seperator2 + minute + 
            seperator2 + second;
            return currentdate;
        },
        getFormatDate2:function(time) {
            var date = time;
            var seperator1 = "/";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (hour >= 0 && hour <= 9) {
                hour = "0" + hour;
            }
            if (minute >= 0 && minute <= 9) {
                minute = "0" + minute;
            }
            if (second >= 0 && second <= 9) {
                second = "0" + second;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + 
            " " + hour + seperator2 + minute + 
            seperator2 + second;
            return currentdate;
        },
        getFormatDate3:function(time) {
            var date = time;
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (hour >= 0 && hour <= 9) {
                hour = "0" + hour;
            }
            if (minute >= 0 && minute <= 9) {
                minute = "0" + minute;
            }
            if (second >= 0 && second <= 9) {
                second = "0" + second;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
                " " + hour;
            return currentdate;
        },
        randomScalingFactor:function() {
            return (Math.random() > 0.5 ? 1.0 : 2.0) * Math.round(Math.random() * 100);
        },
     	validateIP:function (str){
            return !!str.match(/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/);
        },
        printf:function() {
            var as = [].slice.call(arguments),
                fmt = as.shift(),
                i = 0;
            return fmt.replace(/%(\w)?(\d)?([dfsx])/ig, function(_, a, b, c) {
                var s = b ? new Array(b - 0 + 1).join(a || '') : '';
                if (c == 'd') s += parseInt(as[i++]);
                return b ? s.slice(b * -1) : s;
            });
        },
        logout:function(router){
            $.removeCookie('TOKEN');
            $.removeCookie('cokenttt');
            toastr.error("登录异常或失效,请重新登录");
            router.navigate("login", {trigger: true});
        },
        changeNum:function (val) {
            var _intFl = function (obj) {
                if(Math.floor(obj) === obj){
                    return obj;
                }else {
                    return obj.toFixed(1);
                }
            };

            if(val > 1000*1000*1000)
                return _intFl(val/(1000*1000*1000))+"B";
            if(val > 1000*1000)
                return _intFl(val/(1000*1000))+"M";
            if(val > 1000)
                return _intFl(val/(1000))+"K";
            if(val > 0)
                return _intFl(val) +"K";
            else
                return _intFl(val) +"K";
        },
        initTable:function (con,url,columns,extra,router) {
            var view = this;
            var table = $(con);
            var oTable = null;
            if ($.fn.dataTable.isDataTable(con)){
                oTable = $(con).DataTable().ajax.reload(function () {});
            }else {
                oTable = table.DataTable({
                    "processing": true, 
                    "serverSide": true, 
                    "searching": false,
                    "ajax": { 
                        "url": url, 
                        "type": "POST",
                        "data":extra,
                        "dataSrc":function(data){
                            if(data.status=="500"){
                               view.logout(router);
                            }
                            return data.data?data.data:"";
                        }
                    }, 
                    "language": {
                        "aria": {
                            "sortAscending": ": 正序",
                            "sortDescending": ": 反序"
                        },
                        "emptyTable": "无数据",
                        "info": " _START_ - _END_ ,共 _TOTAL_ 条",
                        "infoEmpty": " _START_ - _END_ ,共 _TOTAL_ 条",
                        "infoFiltered": "(共 _MAX_ 条)",
                        "lengthMenu": "每页 _MENU_ 条",
                        "search": "搜索:",
                        "zeroRecords": "搜索到0条"
                    },
                    "order": [[ 1, 'desc' ]],
                    "columns": columns,
                    // "columnDefs": [{
                    //     "orderable": false,
                    //     "targets": [0]
                    // }],
                    // "order": [
                    //     [1, 'asc']
                    // ],
                    // "lengthMenu": [
                    //     [5, 10, 15, 20, -1],
                    //     [5, 10, 15, 20] // change per page values here
                    // ],
                    // // set the initial value
                    // "pageLength": 10,
                    "drawCallback": function (setting) {
                        Metronic.initUniform($('input[type="checkbox"]', table));
                        $(this).find('.group-checkable').prop('checked',false);
                    }
                });
            }
            var tableWrapper = $(con+'_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
            var tableColumnToggler = $(con+'_column_toggler');

            /* modify datatable control inputs */
            tableWrapper.find('.dataTables_length select').select2({minimumResultsForSearch: -1}); // initialize select2 dropdown



            table.off('change', '.group-checkable');
            table.on('change','.group-checkable',function () {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function () {
                    if (checked) {
                        $(this).prop("checked", true);
                        $(this).parents('tr').addClass("active");
                    } else {
                        $(this).prop("checked", false);
                        $(this).parents('tr').removeClass("active");
                    }
                });
                jQuery.uniform.update(set);
            });
            table.off('change', 'tbody tr .checkboxes');
            table.on('change', 'tbody tr .checkboxes', function () {
                $(this).parents('tr').toggleClass("active");
            });
            /* handle show/hide columns*/
            $('input[type="checkbox"]', tableColumnToggler).change(function () {
                /* Get the DataTables object again - this is not a recreation, just a get of the object */
                var iCol = parseInt($(this).attr("data-column"));
                var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
                oTable.fnSetColumnVis(iCol, (bVis ? false : true));
            });
            return oTable;
        },
        //自定义弹框
        alert: function (msg, callback) {
            var ID = '#alert' + Math.round(Math.random() * 100);
            var html = '<div id="' + ID.substring(1, ID.length) + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"  data-backdrop="static" data-keyboard="false" style="top: 12%">' +
                '<div class="modal-dialog" role="document">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" ><span aria-hidden="true">&times;</span></button>' +
                '<h4 class="modal-title">提示消息</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<p style="padding: 15px;margin: 0;text-align: center;font-size: 1.2em;color: #000;">' + msg + '</p>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="alert_modal_sure btn btn-primary" data-dismiss="modal">确认</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $('body').append(html);
            $(ID).find('button').on('click', function (e) {
                e.preventDefault();
                $(ID).next().remove();
                $(ID).remove();
            });
            if (callback) {
                $(ID).find('button').one('click', function (e) {
                    e.preventDefault();
                    callback();
                });
            }
            $(ID).modal('show');
        },
        //自定义确认框
        confirm: function (msg, callback,callback1) {
            var ID = '#confirm' + Math.round(Math.random() * 100);
            var html = '<div id="' + ID.substring(1, ID.length) + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"  data-backdrop="static" data-keyboard="false" style="top: 12%">' +
                '<div class="modal-dialog" role="document">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" ><span aria-hidden="true">&times;</span></button>' +
                '<h4 class="modal-title">提示消息</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<p style="padding: 15px;margin: 0;text-align: center;font-size: 1.2em;color: #000;">' + msg + '</p>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type= "button" class="confirm_modal_sure btn btn-primary" data-dismiss="modal">是</button>' +
                '<button type="button" class="confirm_modal_cancel btn btn-primary" data-dismiss="modal">否</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $('body').append(html);
            $(ID).find('button').on('click', function (e) {
                e.preventDefault();
                $(ID).next().remove();
                $(ID).remove();
            });
            if (callback) {
                $(ID).find('.confirm_modal_sure').one('click', function (e) {
                    e.preventDefault();
                    callback();
                });
            }
            if (callback1) {
                $(ID).find('.confirm_modal_cancel').one('click', function (e) {
                    e.preventDefault();
                    callback1();
                });
            }
            $(ID).modal('show');
        },
        //自定义ajax请求
        request: function (url, data, callback,timeout) {
            var util = this,LOAD = false;
            if(timeout){LOAD = true;}
            timeout ? timeout : timeout = 5000;
            if(LOAD){$('.modal_loading').addClass('show').removeClass('hide');}
            data['token'] = $.cookie("TOKEN")!=undefined?$.cookie("TOKEN").token:"";
            data["t"]=new Date().getTime();
            $.ajax({
                url: url,
                timeout:timeout,
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (json) {
                    if(LOAD){$('.modal_loading').addClass('hide').removeClass('show');}
                    if (json.status == 200) {
                        callback(json);
                    }else if(json.status == 400){
                        toastr.error(json.message);
                    }else if(json.status == 500){
                        toastr.error("登录已过期，请重新登录");
                        setTimeout(function () {
                            $('.modal-backdrop').hide();
                            $.removeCookie('TOKEN');
                            $.removeCookie('cokenttt');
                            window.location.href = "" + window.location.origin + "/dshield-outer-system/#login";
                        },3000);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if(LOAD){$('.modal_loading').addClass('hide').removeClass('show');}
                    if(textStatus=="timeout"){
                        toastr.error("加载超时，请重试");
                    }else{
                        toastr.error("服务请求异常");
                    }
                }
            });
        },
        //XSS
        jsonErgo:function (json) {
            var ergo = function (json) {
                if(Object.prototype.toString.call(json) === '[object Array]'){
                    for(var i=0;i<json.length;i++){
                        json[i] = ergo(json[i]);
                    }
                }
                if(typeof(json) == "object" && Object.prototype.toString.call(json).toLowerCase() == "[object object]"){
                    for(var key in json){
                        if(key == 'title' || key == 'sTitle'){
                            json[key] = json[key];
                        }else {
                            json[key] = ergo(json[key]);
                        }
                    }
                }
                if(Object.prototype.toString.call(json) === '[object String]'){
                    json = xssCheck(json);
                }
                return json;
            };
            json = ergo(json);
            return json;
            function xssCheck(str){
                if(typeof str != 'string'){return str;}
                if (str) {
                    var RexStr = /\<|\>|\&/g;
                    str = str.replace(RexStr, function(MatchStr) {
                        switch (MatchStr) {
                            case "<":
                                return "&lt;";
                                break;
                            case ">":
                                return "&gt;";
                                break;
                            case "&":
                                return "&amp;";
                                break;
                            default:
                                break;
                        }
                    })
                } else {
                    str = '';
                }
                return str;
            }
        }
	};
	return url;
});
