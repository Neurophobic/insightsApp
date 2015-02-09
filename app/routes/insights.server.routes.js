'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var insights = require('../../app/controllers/insights.server.controller');

	// Insights Routes
	app.route('/insights')
		.get(insights.list)
		.post(users.requiresLogin, insights.create);

	app.route('/insights/:insightId')
		.get(insights.read)
		.put(users.requiresLogin, insights.hasAuthorization, insights.update)
		.delete(users.requiresLogin, insights.hasAuthorization, insights.delete);

	// Finish by binding the Insight middleware
	app.param('insightId', insights.insightByID);
};
