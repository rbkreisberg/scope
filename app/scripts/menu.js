define([
	'mediator-js'
], function(mediator) {
'use strict'



function initializeMenu( deferred ){
	setupSideMenu();
	deferred.resolve();
}

function setupSideMenu() {
	$('#sideMenuToggle').on('click', function () {
	    $('#mainPanel').toggleClass('col-md-10 col-md-8').toggleClass('col-lg-10 col-lg-8');
	    $('#sideMenu').toggleClass('col-md-2 col-md-4').toggleClass('col-lg-2 col-lg-4');
	    $('#sideMenuButton').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
	});
	$('#executeBtn').on('click', function() {
		mediator.publish('application:menu:loadData', Menu.state());
	});
}

function getSelectedValue(elementId) {
			var value = $('#' + elementId + ' :selected').val();
			if (value === "All") {value = "*";}
			return value
}

	var Menu = {
		initialize : function(  ) {
			var deferred = $.Deferred();
			initializeMenu( deferred );
			return deferred.promise();
		},
		state: function ( ) {
			return { 
				target : getSelectedValue('inputTarget'),
			 	model : getSelectedValue('inputModel'),
			 	test : getSelectedValue('inputTest')
			};
		}

	};
	return Menu;
});