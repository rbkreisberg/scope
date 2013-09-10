/*global define */
define(['data', 'menu', 'vis', 'mediator-js'], function(data, menu, vis, Mediator) {
    'use strict';

    function applicationEventHandler() {

    }

    function initializeMediator() {
        Mediator.subscribe('application', applicationEventHandler);
    }

    function setup() {
        var deferred = $.Deferred();
        initializeMediator();
        return deferred.promise();
    }

    var App = {
        initialize: function() {
            var deferred = $.when(setup)
                .then(data.initialize)
                .then(menu.initialize)
                .done(vis.initialize);

            return deferred.promise();
        },
        start: function() {
            vis.plot($('#circvis').get(0));
            var state = menu.state();
            var promise = data.request(state);
            promise.done(function(responseObject){
				
				if (responseObject.status === 'success') {
					vis.addData(responseObject.results);
				}
            });
        }
    };
    return App;
});