define([
], function() {
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