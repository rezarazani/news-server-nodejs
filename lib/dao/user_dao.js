
const db = require('../utils/db');
const {normal_type} = require('../config/config');
const bcrypt = require('bcryptjs');

const UserSchema = require('../models/user_model');


// UserSchema.pre('save', function (next) {
// 	const user = this;
// 	if (this.isModified('password') || this.isNew) {
// 		bcrypt.genSalt(10, function (err, salt) {
// 			if (err) {
// 				return next(err);
// 			} else
// 				bcrypt.hash(user.password, salt, function (err, hash) {
// 					if (err) {
// 						return next(err);
// 					}
// 					user.password = hash;
// 					next();
// 				});
// 		});
// 	} else {
// 		return next();
// 	}
// });

UserSchema.statics = {
	register : function(user_name, password, email , account_type=normal_type , full_name) {
		const user = new this({
			user_name,
			password,
			email,
			account_type,
			full_name
		});
	
		return user.save();
	},
	findByUserAndEmail :  function(user_name){
		try{
			return  this.findOne()
				.or([{user_name} , {email : user_name}]);
		}catch(err){
			return err;
		}
	},
	findType :  function(account_type , page , limit){
		try{
			if(account_type){
				return  this.find({account_type})
					.skip((page-1)* limit)
					.limit(limit)
					.sort({_id : -1});

			}else{
				return  this.find({})
					.skip((page-1)* limit)
					.limit(limit)
					.sort({_id : -1});
			}
		}catch(err){
			return err ;
		}
	},
	findCount :  function(account_type){
		try{
			if(account_type){
				return  this.find({account_type}).count();
			}else{
				return  this.count();
			}
		}catch(e){
			return e ;
		}
	},
};

UserSchema.methods = {
	comparePassword :  function (password){
		try {
			// return bcrypt.compare(password , this.password);
			return password == this.password ? true : false ;
		} catch (error) {
			return error;
		}
	}	
};


module.exports = db.model('user', UserSchema);