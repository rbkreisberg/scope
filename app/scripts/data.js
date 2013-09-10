define([
], function() {
	'use strict'

function formURL(filter) {
	return '/variants/variant_tests_summary_090913/' + filter.target + '/' + filter.test + '/' + filter.model;
}

function loadData(filter) {
	return $.when($.getJSON(formURL(filter)));
}

	var Data = {
		initialize : function( ) {
		},
		request : function(filter) {
			return loadData(filter);
		}
	};
	return Data;
});