'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication','$rootScope',
	function($scope, $http, $location, Authentication, $rootScope) {

		$rootScope.passedProject;
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
	//	if ($scope.authentication.user) $location.path('/projects/'+$rootScope.passedProject._id);

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/projects/'+$rootScope.passedProject._id);
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/projects/'+$rootScope.passedProject._id);
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
