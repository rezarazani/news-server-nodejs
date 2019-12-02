const User = require('../dao/user_dao');
const jwt = require('jsonwebtoken');
const SECRET = require('../config/config').secret_token;
const exp = require('../config/config').expiresIn_token;
const debug = require('debug')('nahad:USER_CONTROLLER');
const {userSchemaValid} = require('../helper/validator');
const joi = require('joi');


exports.register = async (req, res, next) =>{
	const {user_name, password, email} = req.body;
	debug(`${user_name} : username`);
	debug(`${password} : password`);
	debug(`${email} : email`);

	try{
		const result = joi.validate({user_name, password, email} , userSchemaValid );
		if(result.error !== null){
			debug('invalid input user');
			res.json(Object.assign(req.base, {
				result: false,
				message: 'invalid input user',
				data : result.error.details[0].message
			}));
		}else{
			const user = await User.register(user_name, password, email);
			if(user){
				debug('user Created');
				res.json(Object.assign(req.base, {
					message: 'Successful',
					data: user
				}));
			}else{
				debug('failed to register user');
				res.json(Object.assign(req.base, {
					result: false,
					message: 'failed to register user'
				}));	
			}
		}

	}catch(e){
		debug(` ${e.message }error in save user`);
		next(new Error('error in save user'));
	}
};
exports.login = async (req , res ,next)=>{
	const {user_name, password} = req.body;
	try{
		const user = await User.findByUserAndEmail(user_name);	
		if(user){
			const isMatch = await user.comparePassword(password);
			if(isMatch){
				const token = jwt.sign(user.toJSON() , SECRET ,{expiresIn : exp});
				// res.setHeader('x-access-token' , token);
				res.json(Object.assign(req.base, {
					message: 'Successful',
					data: token
				}));		
			}else{
				debug('Password is wrong');
				res.json(Object.assign(req.base, {
					result: false,
					message: 'your Password is wrong'
				}));	
			}
		}else {
			debug('Can\'t find user');
			res.json(Object.assign(req.base, {
				result: false,
				message: 'Can\'t find user'
			}));
		}	
	}catch(e){
		debug(`${e.message} : error in login`);
		next(new Error('error in login'));
	}
};