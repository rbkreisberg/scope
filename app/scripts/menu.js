define([
], function() {
'use strict'

function initializeMenu( deferred ){
	deferred.resolve();
}

	var Menu = {
		initialize : function(  ) {
			var deferred = $.Deferred();
			initializeMenu( deferred );
			return deferred.promise();
		}

	};
	return Menu;
});