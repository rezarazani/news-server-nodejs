const db = require('../utils/db');
const jmoment = require('moment-jalaali');
const {managers_type , normal_type} = require('../config/config');
const {photo_type , movie_type , book_type} = require('../config/config');

const mediaSchema = db.Schema({
	title : {
		type : String ,
		required : true , 
		trim : true
	},
	description : {
		type : String ,
		required : true ,
		trim : true
	},
	media : {
		type : String ,
		required : true
	},
	type_media :{
		type : Number ,
		enum : [photo_type,movie_type ,book_type ]
	},
	moment: {
		type: String,
		required: true,
		default: jmoment().format('jYYYY/jMM/jDD  HH:mm')
	},
	author : {
		type : String,
		required : true 
	},
	account_type :{
		type: Number,
		required: true,
		default: managers_type ,
		enum: [managers_type,normal_type]
	}
});


module.exports = mediaSchema ;