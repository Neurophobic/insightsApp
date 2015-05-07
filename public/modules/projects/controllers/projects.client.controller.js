'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects','$rootScope',
	function($scope, $stateParams, $location, Authentication, Projects, $rootScope) {
		$scope.authentication = Authentication;


		$scope.search = function() {
			$scope.text = this.text;
			$location.path('projects/' + $scope.text);
		};

		// Create new Project
		$scope.create = function() {
			// Create new Project object
			var project = new Projects ({
				name: this.name
			});

			// Redirect after save
			project.$save(function(response) {
				$location.path('projects/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Project
		$scope.remove = function(project) {
			if ( project ) {
				project.$remove();

				for (var i in $scope.projects) {
					if ($scope.projects [i] === project) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		// Update existing Project
	/*	$scope.update = function() {
			project = $rootScope.passedProject;
			project.numberinsights = (project.numberinsights+1);
			project.featuredtextinsight = $rootScope.passedInsight.text;
			project.featuredinsighttype = $rootScope.passedTask.type;
			project.featuredimageinsight = $rootScope.passedInsight._id;

			project.$update(function() {
				//$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		}; */

		$scope.update = function() {
			var project = $rootScope.passedProject;
			var finsighttext = $rootScope.passedInsight.text;
			console.log("This is it:" + $rootScope.passedInsight._id);
			project.numberinsights = (project.numberinsights+1);
			project.featuredtextinsight = $rootScope.passedInsightText;
			project.featuredinsighttype = $rootScope.passedTask.type;
			project.featuredimageinsight = $rootScope.passedInsight._id;

			project.$update(function() {
				console.log("added" + $rootScope.passedInsight.text);
				console.log(project.featuredtextinsight);
				project.featuredtextinsight = "What" + $rootScope.passedInsight.text;
				//$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({
				projectId: $stateParams.projectId
			});

			$rootScope.passedProjectId = $stateParams.projectId;
			$rootScope.passedProject = $scope.project;

		};


		// Find existing Project
		$scope.findOneAndAdd = function() {

		console.log($rootScope.passedProjectId);

		$scope.project = Projects.get({
			projectId: $rootScope.passedProjectId
		});

		$rootScope.passedProject.numberinsights.push(1);

		$scope.project.numberinsights = $scope.project.numberinsights + 1;

		console.log($rootScope.passedProject.numberinsights);







		};

		$scope.findOneById = function() {
			$scope.project = Projects.get({
				projectId: $rootScope.passedProjectId
			});

			$scope.project.numberinsights = $scope.project.numberinsights + 1;
		};
	}
]);
