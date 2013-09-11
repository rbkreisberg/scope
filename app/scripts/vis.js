define([
	'configure_circvis'
], function ( circ_config) {
'use strict'

function initializeVis(deferred) {
	deferred.resolve();
}
var configObj;
var circle_vis;
var configInstance;

	var Vis = {
		initialize: function() {
			var deferred = $.Deferred();
			initializeVis(deferred);
			return deferred.promise();
		},
		plot : function(div) {
			configInstance = circ_config.container(div).rings([{key:"FBAT:M",label:"FBAT"}]);
			configObj = configInstance.config();
			circle_vis = new vq.CircVis(configObj);
			circle_vis();
			circle_vis;
		},
		empty : function() {
			circle_vis.removeNodes(function(a) {return true;});
			return this;
		},
		addData : function(data) {
			configObj = circ_config.rings([{key:"FBAT:M",label:"FBAT", data: data}]).config()
			circle_vis.addNodes(data);
			return this;
		}

	};
	return Vis;
});