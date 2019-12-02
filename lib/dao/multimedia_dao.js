const db = require('../utils/db');
const {normal_type} = require('../config/config');
const mediaSchema   = require('../models/multimedia_model');

mediaSchema.statics = {
	saveMedia : function(title , description , medias , account_type=normal_type ,  author , type_media  ){
		try{
			const media = '/uploads/' + medias ;
			const Media = new this({title , description ,media, author , account_type , type_media });
			return Media.save();
		}catch(err){
			return err ;
		}
	},
	getMedia :  function(type_media ,page , limit ){
		try{
			if(page){
				return  this.find({type_media })
					.skip((page-1)* limit)
					.limit(limit)
					.sort({_id : -1});
			}else{
				return  this.find({type_media })
					.sort({_id : -1});
			}
			
		}catch(err){
			return err ;
		}
	},
	getCount :  function(type_media){
		try{
			return  this.find({type_media}).count();
		}catch(err){
			return err ;
		}
	}
};

module.exports = db.model('media' , mediaSchema);

