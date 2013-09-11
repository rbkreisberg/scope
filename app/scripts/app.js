/*global define */
define(['data', 'menu', 'vis', 'mediator-js' ], function(data, menu, vis, mediator) {
    'use strict';

    function applicationEventHandler() {

    }

    function initializeMediator() {
        mediator.subscribe('application', applicationEventHandler);
        mediator.subscribe('application:menu:loadData', loadDataEventHandler);
    }

    function loadDataEventHandler(menuState) {
    	executeLoadData(menuState);
    }

    function executeLoadData(state) {
			var promise = data.request(state);
            promise.done(function(responseObject){				
				if (responseObject.status === 'success') {
					vis.empty().addData(responseObject.results);
				}
            });
    }

    function setup() {        
        return initializeMediator();
    }

    var App = {
        initialize: function() {
        			setup();
            var deferred = $.when(data.initialize)
                .then(menu.initialize)
                .done(vis.initialize);

            return deferred.promise();
        },
        start: function() {
            vis.plot($('#circvis').get(0));
            var state = menu.state();
            executeLoadData(state);
        }
    };
    return App;
});