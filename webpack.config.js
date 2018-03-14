/**
 * Created by bao on 2017/9/18.
 */
var path = require('path');
var OUT_PATH = path.resolve(__dirname,'./bundle');
var APP_PATH = path.resolve(__dirname, './app/js/main.js');
module.exports = {
    //入口
    entry: APP_PATH,
    //出口
    output: {
        path:OUT_PATH,
        publicPath:'./bundle/',
        filename: 'bundle.js'
    },
    module: {
        //加载器配置
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader?modules"
            },{
                test: /\.(png|jpe?g|gif|svg|woff2|eot|svg|ttf|woff)$/,
                loader: 'url-loader?limit=8192&name=img/[name].[ext]'
            },{
                test:  /\.html$/,
                loader: 'html-loader'
            },{
                test: require.resolve("jquery"),
                loader: "expose-loader?$!expose-loader?jQuery"
            },{
                test: require.resolve("requirejs"),
                loader: "expose-loader?requirejs!expose-loader?require!expose-loader?define"
            },{
                test: require.resolve(path.resolve(__dirname, 'app/js/plugins/backbone/underscore_debug')),
                loader: "expose-loader?_"
            }
        ]
    },
    resolve:{
        alias:{
            lib: path.resolve(__dirname, 'app/js/plugins'),
            app: path.resolve(__dirname, 'app/js/app'),
            views: path.resolve(__dirname, 'app/js/views'),
            model: path.resolve(__dirname, 'app/js/model'),
            widget: path.resolve(__dirname, 'app/js/widget'),
            tpl:path.resolve(__dirname, 'app/tpl'),
            style:path.resolve(__dirname, 'app/css'),
            image:path.resolve(__dirname, 'app/image'),

            underscore: path.resolve(__dirname, 'app/js/plugins/backbone/underscore_debug'),
            backbone: path.resolve(__dirname, 'app/js/plugins/backbone/backbone'),
            bootstrap:path.resolve(__dirname, 'app/js/plugins/bootstrap/js/bootstrap.min'),
            datatimepicker: path.resolve(__dirname, 'app/js/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min'),
            validation:path.resolve(__dirname, 'app/js/plugins/jquery-validation/js/jquery.validate'),
            validation_zh:path.resolve(__dirname, 'app/js/plugins/jquery-validation/js/localization/messages_zh.min'),
            additional_methods:path.resolve(__dirname, 'app/js/plugins/jquery-validation/js/additional-methods'),
            blockui:path.resolve(__dirname, 'app/js/plugins/jquery.blockui.min'),
            uniform:path.resolve(__dirname, 'app/js/plugins/uniform/jquery.uniform.min'),
            iCheck:path.resolve(__dirname, 'app/js/plugins/icheck/icheck.min'),
            bootstrapSwitch:path.resolve(__dirname, 'app/js/plugins/bootstrap-switch/js/bootstrap-switch.min'),
            bootstrapConfirmation:path.resolve(__dirname, 'app/js/plugins/bootstrap-confirmation/bootstrap-confirmation.min'),
            tabdrop:path.resolve(__dirname, 'app/js/plugins/bootstrap-tabdrop/js/bootstrap-tabdrop'),
            autosize:path.resolve(__dirname, 'app/js/plugins/autosize/autosize.min'),
            slimscoll:path.resolve(__dirname, 'app/js/plugins/jquery-slimscroll/jquery.slimscroll.min'),
            fancybox:path.resolve(__dirname, 'app/js/plugins/fancybox/source/jquery.fancybox.pack'),
            mousewheel:path.resolve(__dirname, 'app/js/plugins/fancybox/lib/jquery.mousewheel-3.0.6.pack'),
            select2:path.resolve(__dirname, 'app/js/plugins/select2/select2.min'),
            select2_locale_zhCN:path.resolve(__dirname, 'app/js/plugins/select2/select2_locale_zh-CN'),
            scrollTo:path.resolve(__dirname, 'app/js/plugins/jquery.scrollTo.min'),
            tableTools:path.resolve(__dirname, 'app/js/plugins/datatables/extensions/TableTools/js/dataTables.tableTools.min'),
            colReorder:path.resolve(__dirname, 'app/js/plugins/datatables/extensions/ColReorder/js/dataTables.colReorder.min'),
            scroller:path.resolve(__dirname, 'app/js/plugins/datatables/extensions/Scroller/js/dataTables.scroller.min'),
            datatables:path.resolve(__dirname, 'app/js/plugins/datatables/media/js/jquery.dataTables.min'),
            dataTables_bootstrap:path.resolve(__dirname, 'app/js/plugins/datatables/plugins/bootstrap/dataTables.bootstrap'),
            vue:path.resolve(__dirname, 'app/js/plugins/vue/vue.min'),
            wizard:path.resolve(__dirname, 'app/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard'),
            prettify:path.resolve(__dirname, 'app/js/plugins/bootstrap-wizard/prettify'),
            flot:path.resolve(__dirname, 'app/js/plugins/flot/jquery.flot.min'),
            flotResize:path.resolve(__dirname, 'app/js/plugins/flot/jquery.flot.resize.min'),
            flotCategories:path.resolve(__dirname, 'app/js/plugins/flot/jquery.flot.categories.min'),
            flotTime:path.resolve(__dirname, 'app/js/plugins/flot/jquery.flot.time.min'),
            fileinput:path.resolve(__dirname, 'app/js/plugins/bootstrap-fileinput/bootstrap-fileinput'),
            md5:path.resolve(__dirname, 'app/js/plugins/md5.min'),
            cokie:path.resolve(__dirname, 'app/js/plugins/jquery.cokie.min'),
            ion_rangeSlider:path.resolve(__dirname, 'app/js/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min'),
            pace:path.resolve(__dirname, 'app/js/plugins/pace/pace.min'),
            toastr:path.resolve(__dirname, 'app/js/plugins/bootstrap-toastr/toastr.min'),
            idcode:path.resolve(__dirname, 'app/js/plugins/jquery.idcode'),
            codevali:path.resolve(__dirname, 'app/js/plugins/jquery.codevali'),
            loading:path.resolve(__dirname, 'app/js/plugins/shCircleLoader/jquery.shCircleLoader-min'),
            echarts:path.resolve(__dirname, 'app/js/plugins/echarts/echarts'),
            echarts_china:path.resolve(__dirname, 'app/js/plugins/echarts/china'),
            RSA:path.resolve(__dirname, 'app/js/plugins/RSA-js/RSA-A'),

            //app
            router: path.resolve(__dirname, 'app/js/app/router'),
            common: path.resolve(__dirname, 'app/js/app/common'),
            login:path.resolve(__dirname, 'app/js/app/login'),
            mainpage:path.resolve(__dirname, 'app/js/app/mainpage'),
            layout:path.resolve(__dirname, 'app/js/app/layout'),
            metronic:path.resolve(__dirname, 'app/js/app/metronic'),
            demo:path.resolve(__dirname, 'app/js/app/demo'),
            quickSidebar:path.resolve(__dirname, 'app/js/app/quick-sidebar'),
            indexpage:path.resolve(__dirname, 'app/js/app/indexpage'),
            perinfopage:path.resolve(__dirname, 'app/js/app/perinfopage'),
            infopage:path.resolve(__dirname, 'app/js/app/infopage'),
            configpage:path.resolve(__dirname, 'app/js/app/configpage'),
            helppage:path.resolve(__dirname, 'app/js/app/helppage'),
            addconfig:path.resolve(__dirname, 'app/js/app/addconfig')
        }
    }
};