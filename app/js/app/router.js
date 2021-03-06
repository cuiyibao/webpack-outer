define([
    'backbone','mainpage','login',
    'indexpage','configpage','infopage','perinfopage','helppage','addconfig',
    'common'
    ],function(Backbone,Main,Login,
               IndexPage,ConfigPage,InfoPage,PerInfoPage,HelpPage,AddConfigPage,
               Common,toastr) {
        var AppRouter = Backbone.Router.extend({
            initialize: function() {
                _.templateSettings = {
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: /\{\{(.+?)\}\}/g
                };
                $(document).on("click",".page-sidebar-menu li",function(){
                    $(this).addClass("active").siblings().removeClass("active");
                });
                this.isLogin = 0;
                this.user =null;
            },
            routes: {
                "":"login",
                "login":"login",
                "index":"index",
                "addconfig":"addConfig",
                "config":"config",
                "perinfo":"perinfo",
                "infomation":"infomation",
                "help":'help',
                "resource":"resource",
                "business":"business",
                "ruleconfig":"ruleconfig"
            },
            login:function() {
                if($.cookie('TOKEN')){
                    this.navigate("index", {trigger: true});
                }else{
                    var login = new Login(this);
                    this.onloadview =login;
                    this.isLogin = 1;
                }
            },
            index:function() {
                var View = new IndexPage(this);
                this.onloadview = View;
            },
            config:function() {
                var View = new ConfigPage(this);
                this.onloadview = View;
            },
            addConfig:function(){
                $('.page-sidebar-menu li').removeClass("active");
                var View = new AddConfigPage(this);
                this.onloadview = View;
            },
            infomation:function() {
                $('.page-sidebar-menu li').removeClass("active");
                var View = new InfoPage(this);
                this.onloadview = View;
            },
            perinfo:function() {
                $('.page-sidebar-menu li').removeClass("active");
                var View = new PerInfoPage(this);
                this.onloadview = View;
            },
            help:function(){
                var View = new HelpPage(this);
                this.onloadview = View;
            },
            resource:function () {
                var router = this;
                require(['resource'],function (ResourcePage) {
                    var View = new ResourcePage(router);
                    this.onloadview = View;
                });
            },
            business:function () {
                var router = this;
                require(['business'],function (BusinessPage) {
                    var View = new BusinessPage(router);
                    this.onloadview = View;
                });
            },
            ruleconfig:function () {
                var router = this;
                require(['ruleconfig'],function (RuleConfigPage) {
                    var View = new RuleConfigPage(router);
                    this.onloadview = View;
                });
            },
            execute: function(callback, args) {
                var token=null;
                if($.cookie('TOKEN')){
                    if($.cookie('TOKEN').token){
                        token = $.cookie('TOKEN').token;
                    }
                }
                if(token&&this.onloadview&&this.isLogin == 1){//onloadview is login
                    this.onloadview.remove();
                    this.MainView = new Main(this);
                    this.isLogin = 0;
                }else if(token&&this.onloadview&&this.isLogin == 0){//onloadview is other
                    this.onloadview.remove();
                }else if(token&&this.onloadview==undefined&&this.isLogin == 0){//have cookie to index 
                    this.MainView = new Main(this);
                }else if( token == undefined&&this.isLogin == 0){//do not have cookie
                    if(this.MainView)
                        this.MainView.remove();
                    this.MainView = new Main(this);
                }
               
                if (callback) callback.apply(this, args);
            }
        });

        return AppRouter;
    });