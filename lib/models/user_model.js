const db = require('../utils/db');
const jmoment = require('moment-jalaali');
const {managers_type , normal_type} = require('../config/config');

const UserSchema = db.Schema({
	user_name: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		unique: true,
	},
	full_name : {
		type : String
	},
	account_type: {
		type: Number,
		required: true,
		default: normal_type,
		enum: [managers_type,normal_type]
	},
	momnet: {
		type: String,
		required: true,
		default: jmoment().format('jYYYY/jMM/jDD  HH:mm')
	},
	isBlock : {
		type : Boolean ,
		required : true ,
		default : false
	}
});

module.exports = UserSchema ;