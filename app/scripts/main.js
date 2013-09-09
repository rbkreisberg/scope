require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        jqueryUI: '../bower_components/jquery-ui/ui/jquery-ui',
        bootstrap: 'vendor/bootstrap',
        underscore: '../bower_components/underscore/underscore',
        "mediator-js": '../bower_components/mediator-js/lib/mediator',
        vq : '../bower_components/visquick/vq',
        circvis : '../bower_components/visquick/vq.circvis'
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
    	},
        vq : {
                "deps" : ['underscore'],
                exports: 'vq'
        },
    	circvis : {
    			"deps" : ['vq'],
    			exports: 'vq'
    	}
    }
});

require(['app', 'underscore', 'jquery', 'jqueryUI', 'vq', 'circvis', 'bootstrap' ], function (app, _, $) {
    'use strict';
    // use app here
    $.when( app.initialize() ).done(app.start);
});
