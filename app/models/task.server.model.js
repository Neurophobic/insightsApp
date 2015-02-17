'use strict';

/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

/**
* Task Schema
*/
var TaskSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Task name',
		trim: true
	},
	purpose: {
		type: String,
		default: '',
		required: 'Please fill Task purpose',
		trim: true
	},
	type: {
		type: String,
		default: '',
		required: 'Please fill Task type',
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
	project: {
		type: Schema.ObjectId,
		ref: 'Project'
	},
	insights : [{
		 type: Schema.Types.ObjectId,
		 ref: 'Insight' 
	}]

});

mongoose.model('Task', TaskSchema);
