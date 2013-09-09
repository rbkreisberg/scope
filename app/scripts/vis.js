define([
	'configure_circvis'
], function ( circ_config) {
'use strict'

function initializeVis(deferred) {
	deferred.resolve();
}

	var Vis = {
		initialize: function() {
			var deferred = $.Deferred();
			initializeVis(deferred);
			return deferred.promise();
		},
		plot : function(div) {
			var config = circ_config.container(div).config();
			var dataObject = {
				DATATYPE: "vq.models.CircVisData",
				CONTENTS: config
			};
			var circle_vis = new vq.CircVis(dataObject);
			circle_vis();
			return circle_vis;
		}


	};
	return Vis;
});