const db = require('../utils/db');
const {normal_type } = require('../config/config');
const debug = require('debug')('nahad:news_model');
const NewsSchema = require('../models/news_model');


NewsSchema.index({ title: 'text' ,
	description : 'text' ,
	text : 'text' , 
	author : 'text' , 
	category : 'text' ,
	tag : 'text' }, {weights : {title : 4 , description : 3 , tag : 3 }});

NewsSchema.statics = {
	saveNews : function(title, description, text_tag, text, imges ,tagString ,category ,account_typeStrong, author , domain , books){
		const tag = tagString.split(',');
		let img = undefined ;
		let book = undefined ;
		if(imges){
			img = 'uploads/'+imges ;
		}
		if(books){
			book = 'uploads/'+books ;
		}
		const account_type = parseInt(account_typeStrong);
		const _id = db.Types.ObjectId();
		const share = `${domain}/news/${_id}` ;
		const news = new this({
			_id,
			share,
			title,
			description,
			text_tag,
			text,
			img,
			book,
			tag,
			category,
			account_type,
			author
		});
		return news.save();
	},
	findPageAndLimit :   function(page,limit,account_type = 2,category){
		try{
			page = parseInt(page);
			limit = parseInt(limit);
			if(category){
				if(category == 'all'){
					return  this.find({account_type: { $gte: account_type } })
						.skip(parseInt((page - 1) * limit))
						.limit(parseInt(limit))
						.select('title description img category moment author share')
						.sort({ _id: -1 });
				}else{
					return  this.find({ category, account_type: { $gte: account_type } })
						.skip(parseInt((page - 1) * limit))
						.limit(parseInt(limit))
						.select('title description img category moment author share')
						.sort({ _id: -1 });
				}
            
			}else{
				return  this.find({ account_type: { $gte: account_type } }) 
					.skip((page - 1) * limit)
					.limit(limit)
					.select('title description img category moment author share')
					.sort({ _id: -1 });

			}
		}catch(err){
			return err ;
		}

	},
	findSlider :  function(account_type=2){
		try{
			return  this.find({img : {$ne : undefined} , account_type : { $gte : account_type}})
				.sort({_id : -1})
				.limit(3)
				.select('title description img category');
		}catch(err){
			return err ;
		}	
	},
	findByIds :  function(id){
		try{
			return  this.findById(id)
				.select('title description img moment category tag author text text_tag share book').lean();
		}catch(err){
			return err;
		}
	},
	findBookMarkIds :  function(id , page , limit ){
		try{
			return  this.find({_id : {$in : id}})
				.skip((page - 1) * limit)
				.limit(limit)
				.select('title description img moment category tag author share');
		}catch(err){
			return err;
		}
	},
	findBookMarkIdsCount :  function(id){
		try{
			return  this.find({_id : {$in : id}}).count();
		}catch(err){
			return err;
		}
	},
	findRelated :  function({tag , title}  , account_type = normal_type){
		try {
			debug('find Releted' , typeof tag);
			return  this.find({$or : [{$text: {$search: title}} ] 
				,$and :[{account_type : { $gte : account_type}}]}, 
			{score: {$meta: 'textScore'}})
				.sort({score:{$meta:'textScore'}})
				.skip(1)
				.limit(4)
				.select('title description img moment category  author tag');			
		} catch (error) {
			return error ;	
		}	
	},
	findType :  function(account_type , author){  //function(account_type , page , limit , author){
		try{
			if(account_type){
				return  this.find({account_type})
				// .skip((page-1)* limit)
				// .limit(limit)
					.sort({_id : -1});

			}else if(author){
				return  this.find({author})
				// .skip((page-1)* limit)
				// .limit(limit) 
					.sort({_id : -1});
			}else{
				return  this.find({})
				// .skip((page-1)* limit)
				// .limit(limit)
					.sort({_id : -1});
			}
		}catch(err){
			return err ;
		}

	},
	findCount :  function(account_type , author){
		try{
			if(author){
				return  this.find({author}).count();
			}
			if(account_type){
				return  this.find({account_type}).count();
			}else{
				return  this.count();
			}
		}catch(e){
			return e ;
		}
	},
	findCountCategry :  function(category){
		try {
			return  this.find({category}).count();
		} catch (error) {
			return error;
		}
	},
	searchNews :  function(phrase , page , limit , account_type = 2){
		try {
			const start = (parseInt(page) -1) * parseInt(limit) ;
			limit = parseInt(limit);
			return  this.find({$text: {$search: phrase} , 
				account_type : { $gte : account_type}},
			{score: {$meta: 'textScore'}})
				.sort({score:{$meta:'textScore'}})
				.skip(start)
				.limit(limit)
				.select('title description img moment category  author tag');				
		} catch (error) {
			return error ;	
		}
	},
	searchNewsCount :   function(phrase , account_type = 2){
		try {
			return  this.find({$text: {$search: phrase} , 
				account_type : { $gte : account_type}},
			{score: {$meta: 'textScore'}}).count();
		} catch (error) {
			return error ;	
		}
	},
	categoryCount :  function(){
		try {
			return  this.aggregate([
				{$match : { category : { $nin : ['brothers' , 'sisters']} }},
				{$group : {
					_id : '$category' , 
					label : { '$first' : { 
						$switch : {
							branches : [
								{
									case  : {$eq : ['$category' , 'nahadNews']},
									then : 'اخبار نهاد'
								},
								{
									case  : {$eq : ['$category' , 'uniNews']},
									then : 'اخبار دانشگاه'
								},{
									case  : {$eq : ['$category' , 'activities']},
									then : 'عرصه فرهنگی'
								},{
									case  : {$eq : ['$category' , 'multiMedia']},
									then : 'نشریه صوتی و تصویری'
								},{
									case  : {$eq : ['$category' , 'book']},
									then : 'معرفی کتاب'
								}
							],
							default: ''
						} 
					}},
					value : {$sum : 1}
				}},
				{$project: {_id : 0}}
			]);

		} catch (error) {
			return error ;
		}
	},
	chartAllNewsCount :  function(){
		try {
			return  this.aggregate([
				{$group : {
					_id : null,
					normal : {$sum : {$cond :[{$eq : ['$account_type' , 2]},1,0] }},
					managers :{$sum : {$cond :[{$eq : ['$account_type' , 1]},1,0] }}
				}}
			]);
		} catch (error) {
			return error;
		}
	}
};


module.exports = db.model('news' , NewsSchema);
