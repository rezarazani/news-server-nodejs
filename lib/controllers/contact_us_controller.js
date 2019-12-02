const ContactUs = require('../dao/contact_us_dao');
const joi = require('joi');
const debug = require('debug')('nahad:contact_us_controller');
const {ContactUsSchema} = require('../helper/validator');

exports.sendMessageForUs = async (req , res , next)=>{
	try {
		const {email , title , text} = req.body ;
		debug('contanct us' , email , title , text);
		const result = joi.validate({title , text} , ContactUsSchema);
		if(result.error !== null){
			debug('invalid input for Contact Us');
			const  message =result.error.details[0].context.label ;
			res.json(Object.assign(req.base , { result : false , message}));
		}else{
			await ContactUs.sendMessageForUs(title , text , email);
			res.json(Object.assign(req.base , {message : 'پیام دریافت شد'}));
		}

	} catch (error) {
		res.json(Object.assign(req.base , {result : true , message : 'do not received'}));
	}
};