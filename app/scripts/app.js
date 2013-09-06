/*global define */
define([], function () {
    'use strict';

function setup( def ) {
	def.resolve();
}

    var App = {
    	initialize : function() {
    		var deferred = $.Deferred()

    		setup(deferred);

    		return deferred.promise();
    	},
    	start : function() {

    	}
    };
    return App;
});