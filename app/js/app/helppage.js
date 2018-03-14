define([
	'backbone',
	'common',
	'tpl/helppage.html'
], function(Backbone, urls, text,tpl) {
	var View = Backbone.View.extend({
		el: '#page-content',
		initialize: function(router) {
            this.$el.html(tpl);
			this.render();
		},	
		render: function() {			
		},
		remove: function() {
		}
	});
	return View;
});