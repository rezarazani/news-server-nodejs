const db = require('../utils/db');
const ContactUsSchema = require('../models/contact_us_model');


ContactUsSchema.statics = {
	sendMessageForUs : function(title , text , email ){
		const contact = new this ({title , text , email});
		return contact.save();
	} , 
	findAndSortAll : function(){
		return this.find({}).sort({_id : -1});
	}
};

module.exports = db.model('contact_us' , ContactUsSchema);
