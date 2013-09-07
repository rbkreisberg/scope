define([
	'circvis'
], function() {
'use strict'

function initializeVis(deferred) {
	deferred.resolve();
}

	var Vis = {
			initialize : function( ) {
			var deferred = $.Deferred();
			initializeVis(deferred);
			return deferred.promise();
		}
	};
	return Vis;
});