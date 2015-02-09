'use strict';

//Setting up route
angular.module('insights').config(['$stateProvider',
	function($stateProvider) {
		// Insights state routing
		$stateProvider.
		state('listInsights', {
			url: '/insights',
			templateUrl: 'modules/insights/views/list-insights.client.view.html'
		}).
		state('createInsight', {
			url: '/insights/create',
			templateUrl: 'modules/insights/views/create-insight.client.view.html'
		}).
		state('viewInsight', {
			url: '/insights/:insightId',
			templateUrl: 'modules/insights/views/view-insight.client.view.html'
		}).
		state('editInsight', {
			url: '/insights/:insightId/edit',
			templateUrl: 'modules/insights/views/edit-insight.client.view.html'
		});
	}
]);