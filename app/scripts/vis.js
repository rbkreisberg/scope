define([
	'configure_circvis'
], function ( circ_config) {
'use strict'

function initializeVis(deferred) {
	deferred.resolve();
}
var configObj;
var circle_vis;

	var Vis = {
		initialize: function() {
			var deferred = $.Deferred();
			initializeVis(deferred);
			return deferred.promise();
		},
		plot : function(div) {
			configObj = circ_config.container(div).rings([{key:"FBAT:M",label:"FBAT"}]).config();
			circle_vis = new vq.CircVis(configObj);
			circle_vis();
			circle_vis;
		},
		addData : function(data) {
			circle_vis.addNodes(data);
		}

	};
	return Vis;
});