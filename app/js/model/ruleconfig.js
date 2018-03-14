/**
 * Created by bao on 2018/1/22.
 */
define([
    'backbone'
], function(Backbone) {
    var AppModel = Backbone.Model.extend({
        initialize: function(){
            this.bind("invalid", function(model, error){
                if(error){
                    console.log(error);
                }
            });
        },
        defaults:{
            h1:"资源配置",
            h2:"已选配置"
        }
    });
    //工厂构造，每次调用直接初始化一个model对象
    //var o = new AppModel();
    //return o;
    return new AppModel();
});