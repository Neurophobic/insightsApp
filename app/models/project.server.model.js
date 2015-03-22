'use strict';

/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

/**
* Project Schema
*/
var ProjectSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project name',
		trim: true
	},
	desc: {
		type: String,
		default: '',
		required: 'Please fill Project description',
		trim: true
	},
	color: {
		type: String,
		default: 'blue',
		trim: true
	},
	participants: {
		type: Number,
		default: 0,
		trim: true
	},
	numberinsights: {
		type: Number,
		default: 0,
		trim: true
	},
	featuredinsighttype: {
		type: String,
		default:'text',
		trim: true
	},
	featuredtextinsight: {
		type: String,
		default:'This is a text insight',
		trim: true
	},
	featuredimageinsight: {
		type: String,
		default:'This is a image insight',
		trim: true
	},
	numbertasks: {
		type: Number,
		default: 0,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Project', ProjectSchema);
