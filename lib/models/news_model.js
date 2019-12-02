const db = require('../utils/db');
const jmoment = require('moment-jalaali');
const {managers_type , normal_type } = require('../config/config');


const NewsSchema = db.Schema({
	title : {
		type : String ,
		required: true,
		trim: true
	},
	description : {
		type : String ,
		required : true ,
		trim : true
	},
	text_tag : {
		type : String,
		required : true
	},
	text : {
		type : String,
		// required : true,
		trim: true
	},
	img: { 
		type: String 
	},
	book : {
		type : String
	},
	moment: {
		type: String,
		required: true,
		default: jmoment().format('jYYYY/jMM/jDD  HH:mm')
	},
	author : {
		type : String ,
		required : true,
		trim : true
	},
	tag : [{
		type : String
	}],
	category :{
		type : String ,
		enum : ['nahadNews','uniNews','activities' , 'multiMedia' , 'book' , 'brothers' , 'sisters']
		// enum : [{'nahadNews' : 'اخبار نهاد' },{'uniNews' : 'اخبار دانشگاه'},{'activities' : 'فعالان عرصه فرهنگی' }, { 'multiMedia' : 'نشریه صوتی و تصویری'} , {'book' : 'معرفی کتاب'}]

	},
	account_type :{
		type: Number,
		required: true,
		default: managers_type ,
		enum: [managers_type,normal_type]
	},
	share : {
		type : String , 
	}
});
module.exports = NewsSchema ;