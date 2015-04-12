'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Insight Schema
 */
var InsightSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	text: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	_creator: {
		type: Schema.ObjectId,
		ref: 'Task'
	},
	taskid: {
		type: Schema.ObjectId,
		ref: 'Taskid'
	},
	image: {
		type: String,
		default:''
	},
	projectid: {
		type: Schema.ObjectId,
		ref:'Projectid'
	},
	type: {
		type: String,
		default:'text',
		trim: true
	},
	city: {
		type: String,
		default:'Nowhere',
		trim:true
	}

});

mongoose.model('Insight', InsightSchema);
