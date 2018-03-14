define([
    'backbone',
    'router'
], function(Backbone, router) {
    var app_router = new router();
    Backbone.history.start();
});