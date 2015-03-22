'use strict';

//Insights service used to communicate Insights REST endpoints
angular.module('insights')

.factory('Insights', ['$resource',
	function($resource) {
		return $resource('insights/:insightId', { insightId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
