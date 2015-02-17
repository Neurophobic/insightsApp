'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Insight = mongoose.model('Insight'),
	_ = require('lodash');

/**
 * Create a Insight
 */
exports.create = function(req, res) {
	var insight = new Insight(req.body);
	insight.user = req.user;



	insight.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(insight);
		}
	});
};

/**
 * Show the current Insight
 */
exports.read = function(req, res) {
	res.jsonp(req.insight);
};

/**
 * Update a Insight
 */
exports.update = function(req, res) {
	var insight = req.insight ;

	insight = _.extend(insight , req.body);

	insight.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(insight);
		}
	});
};

/**
 * Delete an Insight
 */
exports.delete = function(req, res) {
	var insight = req.insight ;

	insight.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(insight);
		}
	});
};

/**
 * List of Insights
 */
exports.list = function(req, res) {
	Insight.find().sort('-created').populate('user', 'displayName').exec(function(err, insights) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(insights);
		}
	});
};

/**
 * Insight middleware
 */
exports.insightByID = function(req, res, next, id) {
	Insight.findById(id).populate('user', 'displayName').exec(function(err, insight) {
		if (err) return next(err);
		if (! insight) return next(new Error('Failed to load Insight ' + id));
		req.insight = insight ;
		next();
	});
};

/**
 * Insight authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.insight.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

//image uploader
