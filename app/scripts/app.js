/*global define */
define(['data','menu', 'vis','mediator-js'], function (data, menu, vis, Mediator) {
    'use strict';

    function applicationEventHandler() {

    }

    function initializeMediator() {
    	Mediator.subscribe('application', applicationEventHandler);
    }

function setup( ) {
	var deferred = $.Deferred();
	initializeMediator();
	return deferred.promise();
}

    var App = {
    	initialize : function() {
    		var deferred = $.when(setup)
    			.then(data.initialize)
	    		.then(menu.initialize)
	    		.done(vis.initialize);
	    		
    		return deferred.promise();
    	},
    	start : function() {
    		console.log('start!');
    	}
    };
    return App;
});