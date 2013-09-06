require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        jqueryUI: '../bower_components/jquery-ui/ui/jquery-ui',
        bootstrap: 'vendor/bootstrap',
        underscore: '../bower_components/underscore/underscore',
        "mediator-js": '../bower_components/mediator-js/lib/mediator'
    },
    shim : {
    	"bootstrap" : {
    			"deps":['jquery'],
    			"exports": 'bootstrap'
    	},
        "jqueryUI" : {
                "deps": ['jquery'],
                "exports": '$'
        },
    	"underscore" : {
    		"exports": '_'
    	}
    }
});

require(['app', 'underscore', 'jquery', 'jqueryUI','bootstrap' ], function (app, _, $) {
    'use strict';
    // use app here
    $.when( app.initialize() ).done(app.start);
});
