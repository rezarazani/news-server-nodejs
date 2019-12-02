const db = require('../utils/db');
const jmoment = require('moment-jalaali');

const ContactUsSchema = db.Schema({
	email: {
		type: String,
		required : true
	},
	title : {
		type : String , 
		required : true ,
		trim : true 
	},
	text : {
		type : String ,
		required : true ,
		trim : true 
	},
	moment: {
		type: String,
		required: true,
		default: jmoment().format('jYY/jMM/jDD HH:mm')
	}
});

// const contactUs = db.model('contact_us' , ContactUsSchema);

module.exports = ContactUsSchema ;