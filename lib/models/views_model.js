const db = require('../utils/db');
const jmoment = require('moment-jalaali');
const {managers_type , normal_type} = require('../config/config');

const ViewsSchema = db.Schema({
	moment: {
		type: Date,
		required: true,
		default: jmoment().format('jYYYY/jMM/jDD  HH:mm')
	},
	account_type: {
		type: Number,
		required: true,
		default: normal_type,
		enum: [managers_type,normal_type]
	}
});


module.exports = ViewsSchema ;