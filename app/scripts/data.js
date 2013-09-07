define([
], function() {
'use strict'

function loadData(deferred ) {
	deferred.resolve();
}

	var Data = {
		initialize : function( ) {
			var deferred = $.Deferred();
			loadData(deferred);
			return deferred.promise();
		}
	};
	return Data;
});