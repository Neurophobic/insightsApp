'use strict';

(function() {
	// Insights Controller Spec
	describe('Insights Controller Tests', function() {
		// Initialize global variables
		var InsightsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Insights controller.
			InsightsController = $controller('InsightsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Insight object fetched from XHR', inject(function(Insights) {
			// Create sample Insight using the Insights service
			var sampleInsight = new Insights({
				name: 'New Insight'
			});

			// Create a sample Insights array that includes the new Insight
			var sampleInsights = [sampleInsight];

			// Set GET response
			$httpBackend.expectGET('insights').respond(sampleInsights);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.insights).toEqualData(sampleInsights);
		}));

		it('$scope.findOne() should create an array with one Insight object fetched from XHR using a insightId URL parameter', inject(function(Insights) {
			// Define a sample Insight object
			var sampleInsight = new Insights({
				name: 'New Insight'
			});

			// Set the URL parameter
			$stateParams.insightId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/insights\/([0-9a-fA-F]{24})$/).respond(sampleInsight);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.insight).toEqualData(sampleInsight);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Insights) {
			// Create a sample Insight object
			var sampleInsightPostData = new Insights({
				name: 'New Insight'
			});

			// Create a sample Insight response
			var sampleInsightResponse = new Insights({
				_id: '525cf20451979dea2c000001',
				name: 'New Insight'
			});

			// Fixture mock form input values
			scope.name = 'New Insight';

			// Set POST response
			$httpBackend.expectPOST('insights', sampleInsightPostData).respond(sampleInsightResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Insight was created
			expect($location.path()).toBe('/insights/' + sampleInsightResponse._id);
		}));

		it('$scope.update() should update a valid Insight', inject(function(Insights) {
			// Define a sample Insight put data
			var sampleInsightPutData = new Insights({
				_id: '525cf20451979dea2c000001',
				name: 'New Insight'
			});

			// Mock Insight in scope
			scope.insight = sampleInsightPutData;

			// Set PUT response
			$httpBackend.expectPUT(/insights\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/insights/' + sampleInsightPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid insightId and remove the Insight from the scope', inject(function(Insights) {
			// Create new Insight object
			var sampleInsight = new Insights({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Insights array and include the Insight
			scope.insights = [sampleInsight];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/insights\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInsight);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.insights.length).toBe(0);
		}));
	});
}());