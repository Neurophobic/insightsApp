'use strict';

// Insights controller
angular.module('insights').controller('InsightsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Insights', '$rootScope','$upload',
	function($scope, $stateParams, $location, Authentication, Insights, $rootScope, $upload) {
		$scope.authentication = Authentication;

		// Create new Insight
		$scope.create = function() {
			// Create new Insight object



			var insight = new Insights ({
				name: this.name,
				text: this.text,
				_creator: $rootScope.passedTask._id,
				taskid: $rootScope.passedTask._id,
				projectid: $rootScope.passedProject._id,
				type: $rootScope.passedTask.type,
				city: $rootScope.city

			});





			// Redirect after save
			insight.$save(function(response) {
				$location.path('insights/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.geolocate = function(){
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position){
					$scope.$apply(function(){
						$scope.position = position;
						$scope.longitude = position.coords.longitude;
						$scope.latitude = position.coords.latitude
						console.log("lat="+$scope.latitude+" Longitude="+$scope.longitude);


						$scope.geocoder = new google.maps.Geocoder()

						$scope.latlng = new google.maps.LatLng($scope.latitude, $scope.longitude);
						console.log($scope.latlng);
						$scope.geocoder.geocode({
							latLng: $scope.latlng
						}, function(results, status) {
							if (status === google.maps.GeocoderStatus.OK){
								$scope.address= results;
								$scope.city = $scope.address[0].address_components[2].long_name;
								$rootScope.city = $scope.city;
								console.log($scope.address[0]);
								console.log($scope.city);
								console.log($scope.address[0].formatted_address);
							}
						});
					});
				});



			}
		}

		// Create new Insight
		$scope.instacreate = function() {
			// Create new Insight object
			$scope.geolocate();

			var insight = new Insights ({
				name: this.name,
				text: this.text,
				_creator: $rootScope.passedTask._id,
				taskid: $rootScope.passedTask._id,
				projectid: $rootScope.passedProject._id,
				type: $rootScope.passedTask.type,

				city: $rootScope.city

			});




			// Redirect after save
			insight.$save(function(response) {
				$rootScope.passedInstaInsight = response._id;
				$rootScope.passedInsight = response;

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Insight
		$scope.remove = function(insight) {
			if ( insight ) {
				insight.$remove();

				for (var i in $scope.insights) {
					if ($scope.insights [i] === insight) {
						$scope.insights.splice(i, 1);
					}
				}
			} else {
				$scope.insight.$remove(function() {
					$location.path('insights');
				});
			}
		};

		// Update existing Insight
		$scope.update = function() {
			var insight = $scope.insight;

			insight.$update(function() {
				$location.path('insights/' + insight._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Insights
		$scope.find = function() {
			$scope.insights = Insights.query();
		};

		// Find existing Insight
		$scope.findOne = function() {
			$scope.insight = Insights.get({
				insightId: $stateParams.insightId
			});
			console.log($scope.insight);
			$rootScope.passedInsight = $scope.insight;
		};




	}
]);
