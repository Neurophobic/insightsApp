'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Insight = mongoose.model('Insight'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, insight;

/**
 * Insight routes tests
 */
describe('Insight CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Insight
		user.save(function() {
			insight = {
				name: 'Insight Name'
			};

			done();
		});
	});

	it('should be able to save Insight instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Insight
				agent.post('/insights')
					.send(insight)
					.expect(200)
					.end(function(insightSaveErr, insightSaveRes) {
						// Handle Insight save error
						if (insightSaveErr) done(insightSaveErr);

						// Get a list of Insights
						agent.get('/insights')
							.end(function(insightsGetErr, insightsGetRes) {
								// Handle Insight save error
								if (insightsGetErr) done(insightsGetErr);

								// Get Insights list
								var insights = insightsGetRes.body;

								// Set assertions
								(insights[0].user._id).should.equal(userId);
								(insights[0].name).should.match('Insight Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Insight instance if not logged in', function(done) {
		agent.post('/insights')
			.send(insight)
			.expect(401)
			.end(function(insightSaveErr, insightSaveRes) {
				// Call the assertion callback
				done(insightSaveErr);
			});
	});

	it('should not be able to save Insight instance if no name is provided', function(done) {
		// Invalidate name field
		insight.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Insight
				agent.post('/insights')
					.send(insight)
					.expect(400)
					.end(function(insightSaveErr, insightSaveRes) {
						// Set message assertion
						(insightSaveRes.body.message).should.match('Please fill Insight name');
						
						// Handle Insight save error
						done(insightSaveErr);
					});
			});
	});

	it('should be able to update Insight instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Insight
				agent.post('/insights')
					.send(insight)
					.expect(200)
					.end(function(insightSaveErr, insightSaveRes) {
						// Handle Insight save error
						if (insightSaveErr) done(insightSaveErr);

						// Update Insight name
						insight.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Insight
						agent.put('/insights/' + insightSaveRes.body._id)
							.send(insight)
							.expect(200)
							.end(function(insightUpdateErr, insightUpdateRes) {
								// Handle Insight update error
								if (insightUpdateErr) done(insightUpdateErr);

								// Set assertions
								(insightUpdateRes.body._id).should.equal(insightSaveRes.body._id);
								(insightUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Insights if not signed in', function(done) {
		// Create new Insight model instance
		var insightObj = new Insight(insight);

		// Save the Insight
		insightObj.save(function() {
			// Request Insights
			request(app).get('/insights')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Insight if not signed in', function(done) {
		// Create new Insight model instance
		var insightObj = new Insight(insight);

		// Save the Insight
		insightObj.save(function() {
			request(app).get('/insights/' + insightObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', insight.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Insight instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Insight
				agent.post('/insights')
					.send(insight)
					.expect(200)
					.end(function(insightSaveErr, insightSaveRes) {
						// Handle Insight save error
						if (insightSaveErr) done(insightSaveErr);

						// Delete existing Insight
						agent.delete('/insights/' + insightSaveRes.body._id)
							.send(insight)
							.expect(200)
							.end(function(insightDeleteErr, insightDeleteRes) {
								// Handle Insight error error
								if (insightDeleteErr) done(insightDeleteErr);

								// Set assertions
								(insightDeleteRes.body._id).should.equal(insightSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Insight instance if not signed in', function(done) {
		// Set Insight user 
		insight.user = user;

		// Create new Insight model instance
		var insightObj = new Insight(insight);

		// Save the Insight
		insightObj.save(function() {
			// Try deleting Insight
			request(app).delete('/insights/' + insightObj._id)
			.expect(401)
			.end(function(insightDeleteErr, insightDeleteRes) {
				// Set message assertion
				(insightDeleteRes.body.message).should.match('User is not logged in');

				// Handle Insight error error
				done(insightDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Insight.remove().exec();
		done();
	});
});