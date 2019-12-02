const jwt = require('jsonwebtoken');
const {secret_token , managers_type , normal_type} = require('../config/config');
const text = require('../helper/const_text');
const debug = require('debug')('nahad:GUARD');

exports.guard ={
	//main Guard not used yet    
	mainGuard :	function guard(accountType=normal_type){
		return function(req , res , next){
			try{
				const token = req.headers['x-access-token'];
				if(token){
					const payload = jwt.verify(token ,secret_token);
					if(payload.account_type >= accountType){
						debug(`${payload.user_name} you can access to this route`);
						req.credentianls = payload ;
						next();
					}else{
						debug(`${payload.user_name} you can't access to this route`);
						res.status(403).json(Object.assign(req.base , {
							result: false,
							message: 'access denied'
						}));
					}
				}else{
					debug('authentication is failed');
					req.credentianls = {account_type : normal_type} ;
					next();
				}
			}catch(e){
				debug(`${e.message} server error`);
				res.json(Object.assign(req.base ,{
					result: false,
					message: 'server Error',
					data: e.message
				}));
				debug(e.message);
			}
		};
	},
	panelGuard : function(req , res , next){
		try{
			const token = req.cookies.auth ;
			if(token){
				const payload = jwt.verify(token ,secret_token);
				if(payload.account_type == managers_type){
					debug(`${payload.user_name} you can access to this route`);
					req.credentials = payload ;
					res.locals.userIn = payload;
					debug(`${req.credentials} req.credentials`);
					next();
				}else{
					debug(`${payload.user_name} you can't access to this route`);
					req.app.locals.layout = '';				
					res.render('page/error_page' , { 
						errorNumber : text.error_number_403 , 
						title : text.title_error ,
						subtitle : text.sub_title_error });					
				}
			}else{
				debug('authentication is failed');
				req.app.locals.layout = '';
				// res.render('page/error_page' , {
				// 	errorNumber : text.error_number_401 , 
				// 	title : text.title_error ,
				// 	subtitle : text.sub_title_error });	
				res.render('login');								
			}
		}catch(e){
			debug(`${e.message} server error`);
			req.app.locals.layout = '';
			// res.render('page/error_page' , {
			// 	errorNumber : text.error_number_500 , 
			// 	title : text.title_error_500 ,
			// 	subtitle : text.sub_title_error });									
			res.render('login');
		}
	}
	
};