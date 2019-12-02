const News = require('../dao/news_dao');
const User = require('../dao/user_dao');
const Views = require('../dao/ views_dao');
const Media = require('../dao/multimedia_dao');
const contactUs = require('../dao/contact_us_dao');
const jwt = require('jsonwebtoken');
const text = require('../helper/const_text');
const {newsSchemaValid , picSchemaValid , managerSchemaValid}= require('../helper/validator');
const joi = require('joi');
const {normal_type  , managers_type ,
	secret_token , expiresIn_token ,
	photo_type, movie_type , domain } = require('../config/config');
const debug = require('debug')('nahad:panel_controller');
		
const limit = 10 ;

exports.login = (req, res, next) => {
	req.app.locals.layout = '';
	res.render('login');
};
exports.signIn = async (req , res , next)=>{
	const {user_name, password} = req.body;
	try{
		const user = await User.findByUserAndEmail(user_name);
		if(user && user.account_type == managers_type && !user.isBlock){
			const isMatch = await user.comparePassword(password);
			if(isMatch){
				const token = jwt.sign(user.toJSON() , secret_token ,{expiresIn : expiresIn_token});
				
				req.app.locals.layout = 'index';  
				res.cookie('auth',token);
				res.redirect('/panel/main');
				// res.render('page/index' ,{userIn : user});	
			}else{
				debug('Password is wrong');
				res.render('login' , {mesagge : 'رمز ورود اشتباه'});	
			}
		}else {
			debug('Can\'t find user');
			res.render('login' , {mesagge : 'نام کاربری وجود ندارد '});				
		}	
	}catch(e){
		debug(`${e.message} : error in login`);
		next(new Error('error in login'));
	}

};
exports.mainPage = async (req, res, next) => {
	await Views.saveViews(managers_type);  //for test

	res.render('page/index' );
};
exports.ViewsCount = async (req , res , next )=>{
	const ViewsCount = await Views.viewsCount();
	debug('Views Count %j' , ViewsCount);
	const ViewsDate = [],	ViewsNormal = [],	ViewsManager = [] , ViewsTotal = [] ;
	ViewsCount.forEach(elm => {
		ViewsDate.push(elm.date);
		ViewsNormal.push(elm.normal);
		ViewsManager.push(elm.managers);
		ViewsTotal.push(elm.totalViews);
	});

	res.json({ViewsDate , ViewsNormal , ViewsManager , ViewsTotal});
};
exports.NorAndManViewsCount = async (req , res ,next)=>{
	const allNews = await News.chartAllNewsCount();

	res.json({
		normalNewsCount : allNews[0].normal,
		mangerNewsCount : allNews[0].managers,
	});
};
exports.allViewsCount = async (req , res ,next)=>{
	const allViewsCount = await Views.count();
	const allNewsCount = await News.count();
	res.json({allViewsCount , allNewsCount });

};
exports.categoryChar = async (req,res , next)=>{
	const categoryChar = await News.categoryCount();

	res.json(categoryChar);

};

exports.allNews = async (req, res, next) => {
	try {
		// const limit = 10 ;
		// const page = req.query.page || 1 ;
		const news = await News.findType(); //News.findType(null , page , limit);
		// const newsCount = await News.findCount();
		res.render('page/news/all_news', {
			tableTitle : text.tableTitle_all_news ,
			news  ,
			// limit ,
			// current : parseInt(page) ,
			// pages : Math.ceil(newsCount / limit)  
		}); 
	} catch (e) {
		debug(`${e.message} : error in get all news`);
		next(new Error('error in get all news'));
	}
};
exports.normalNews = async (req, res, next) => {
	try {
		// const limit = 10 ;
		// const page = req.query.page || 1 ;
		const news = await News.findType(normal_type); //News.findType(normal_type, page, limit);
		// const newsCount = await News.findCount(normal_type);
		res.render('page/news/base_news', {
			tableTitle : text.tableTitle_normal ,
			news,
			// limit, 
			// current : parseInt(page) ,
			// pages : Math.ceil(newsCount / limit)
		});  						
	} catch (e) {
		debug(`${e.message} : error in get normal news`);
		next(new Error('error in get normal news'));
	}
};
exports.myNews = async(req,res,next)=>{
	try {
		// const page = req.query.page || 1 ;
		const author = req.credentials.full_name;
		const news = await News.findType(null,author);  //News.findType(null, page, limit ,author);
		// const newsCount = await News.findCount(null , author);

		res.render('page/news/all_news' , 	{
			title : text.title_my_news ,
			tableTitle : text.tableTitle_my_news ,
			news,
			// limit, 
			// current : parseInt(page) ,
			// pages : Math.ceil(newsCount / limit)
		});								
	} catch (error) {
		debug(`${error.message} : error in get my news`);
		next(new Error('error in get my news'));
	}
};
exports.managersNews = async (req, res, next) => {
	try {
		// const limit = 10 ;
		// const page = req.query.page || 1 ;
		const news = await News.findType(managers_type); //News.findType(managers_type, page, limit);
		// const newsCount = await News.findCount(managers_type);

		res.render('page/news/base_news', {
			title : text.title_manager ,
			tableTitle : text.tableTitle_manager ,
			news,
			// limit, 
			// current : parseInt(page) ,
			// pages : Math.ceil(newsCount / limit) 
		});  
	} catch (e) {
		debug(`${e.message} : error in get managers news`);
		next(new Error('error in get managers news'));
	}
};	
exports.creatNews = (req, res, next) => {
	res.render('page/news/send_news');
};
exports.sendNews = async (req , res ,next)=>{
	try{
		const {title , description ,text_tag,text  , tag , category , account_type} = req.body ;
		const {full_name} = req.credentials ;
		let imges = undefined ;
		if(req.file){
			imges = '' || req.file.filename ;
		}
		const result = joi.validate({title,description , text , text_tag ,tag} , newsSchemaValid) ;
		if(result.error !== null){
			debug('invalid input user');
			const  message =result.error.details[0].context.label ;
			res.render('page/news/send_news' , {title , description , text_tag , tag , category ,account_type, message });
		}else{
			debug(`${domain} : domain`);
			const newNews = await News.saveNews(title , description ,text_tag,
				text, imges ,tag , category , 
				account_type , full_name  , domain);
			if(newNews){
				debug(`${newNews}   :  newNews`);
				req.flash('success-message' , `" ${newNews.title} " با موفقیت ساخته شد `);
				res.redirect('/panel/send_news');
			}else{
				req.flash('error_message' , 'ساخته نشد دوباره تلاش کنید');
				res.redirect('/panel/send_news');
			}
		}
	}catch(err){
		debug(`${err.message} : error in send  news`);
		next(new Error('error in send news'));		
	}
};
exports.creatNewsPic =  (req , res , next)=>{
	res.render('page/news/upload_pic');
};
exports.sendNewsPic = async (req , res ,next ) =>{
	try{
		const {title , description , account_type } = req.body ;
		const {full_name} = req.credentials ;
		const result = joi.validate({title,description } , picSchemaValid) ;
		if(result.error !== null){
			debug('invalid input user');
			req.flash('error_message' ,`ورودی های نا معتبر در ${result.error.details[0].context.label} ‍`);
			res.redirect('/panel/send_news_pic');			
		}
		let imges = undefined ;
		if(req.file){
			imges = '' || req.file.filename ;
			const newMedia = await Media.saveMedia(title , description ,imges, account_type ,full_name ,photo_type) ;
			if(newMedia){
				req.flash('success-message' , `" ${newMedia.title} " با موفقیت ساخته شد `);
				res.redirect('/panel/send_news_pic');
			} else{
				req.flash('error_message' , 'ساخته نشد دوباره تلاش کنید');
				res.redirect('/panel/send_news_pic');
			}
		}else{
			req.flash('error_message' , 'عکس ارسال نشد دوباره تلاش کنید');
			res.redirect('/panel/send_news_pic');
		}
	}catch(err){
		debug(`${err.message} : error in send pic news`);
		next(new Error('error in send pic news'));
	}
};
exports.creatNewsMov =(req,res ,next) =>{
	res.render('page/news/upload_mov');
};
exports.sendNewsMov = async (req , res , next)=>{
	try{
		const {title , description , account_type } = req.body ;
		const {full_name} = req.credentials ;
		const result = joi.validate({title,description } , picSchemaValid) ;
		if(result.error !== null){
			debug('invalid input user');
			req.flash('error_message' ,`ورودی های نا معتبر در ${result.error.details[0].context.label} ‍`);
			res.redirect('/panel/send_news_mov');			
		}
		let movie = undefined ;
		if(req.file){
			movie = '' || req.file.filename ;
			
			const newMedia = await Media.saveMedia(title , description ,movie, account_type ,full_name ,movie_type ) ;
			if(newMedia){
				req.flash('success-message' , `" ${newMedia.title} " با موفقیت ساخته شد `);
				res.redirect('/panel/send_news_mov');
			} else{
				req.flash('error_message' , 'ساخته نشد دوباره تلاش کنید');
				res.redirect('/panel/send_news_mov');
			}
		}else{
			req.flash('error_message' , 'عکس ارسال نشد دوباره تلاش کنید');
			res.redirect('/panel/send_news_mov');
		}
	}catch(err){
		debug(`${err.message} : error in send movie news`);
		next(new Error('error in send movie news'));
	}
};
exports.creatNewsBook = (req , res , next)=>{
	res.render('page/news/upload_book');
},
exports.sendNewsBook = async (req , res , next)=>{
	try{
		const {title , description ,text_tag,text  , tag  , account_type} = req.body ;
		const {full_name} = req.credentials ;
		let imges = undefined ;
		let book  = undefined ;
		if(req.files){
			imges = '' || req.files['img'][0].filename ;
			debug(`${imges} : imges`);
			book  = '' || req.files['book'][0].filename;
			debug(`${book} : book`);
		}
		const result = joi.validate({title,description , text , text_tag ,tag} , newsSchemaValid) ;
		if(result.error !== null){
			debug('invalid input user');
			const  message =result.error.details[0].context.label ;
			res.render('page/news/upload_book' , {title , description , text_tag , tag  ,account_type, message });
		}else{
			debug(`${domain} : domain`);
			const newNews = await News.saveNews(title , description ,text_tag,
				text, imges ,tag , 'book' , 
				account_type , full_name  , domain , book);
			if(newNews){
				debug(`${newNews}   :  newNews`);
				req.flash('success-message' , `" ${newNews.title} " با موفقیت ساخته شد `);
				res.redirect('/panel/send_news_book');
			}else{
				req.flash('error_message' , 'ساخته نشد دوباره تلاش کنید');
				res.redirect('/panel/send_news_book');
			}
		}
	}catch(err){
		debug(`${err.message} : error in send book news`);
		next(new Error('error in send book news'));		
	}
},
exports.deleteNews = async(req ,res , next)=>{
	try {
		const news = await News.findByIdAndDelete(req.params.id);
		req.flash('success-message' , `" ${news.title} " با موفقیت حذف شد `);
		res.redirect('/panel/all_news');
	} catch (e) {
		debug(`${e.message} : error in delete news`);
		req.flash('error_message' , ' حذف نشد دوباره تلاش کنید ');
		next(new Error('error in delete news'));
	}	
};


exports.getPhoto = async (req , res , next)=>{
	const page = req.query.page || 1 ;	
	const media = await Media.getMedia(photo_type ,page , limit);
	const phothoCount = await Media.getCount(photo_type);
	res.render('page/media/photo' , {
		media ,
		current : parseInt(page) ,
		pages : Math.ceil(phothoCount / limit) });
};
exports.deletePhoto = async (req , res , next)=>{
	try {
		const media = await Media.findByIdAndDelete(req.params.id);
		req.flash('success-message' , `" ${media.title} " با موفقیت حذف شد `);
		res.redirect('/panel/photo');
	} catch (e) {
		debug(`${e.message} : error in delete photo`);
		req.flash('error_message' , ' حذف نشد دوباره تلاش کنید ');
		next(new Error('error in delete news'));
	}		
};

exports.getMovie = async (req, res ,next)=>{
	// const page = req.query.page || 1 ;	
	const media = await Media.getMedia(movie_type); //Media.getMedia(movie_type ,page , limit);
	// const phothoCount = await Media.getCount(movie_type);
	res.render('page/media/movie' , {
		media ,
		// current : parseInt(page) ,
		// pages : Math.ceil(phothoCount / limit)
	});
	
};
exports.deleteMovie = async (req , res , next )=>{
	try {
		const media = await Media.findByIdAndDelete(req.params.id);
		req.flash('success-message' , `" ${media.title} " با موفقیت حذف شد `);
		res.redirect('/panel/movie');
	} catch (e) {
		debug(`${e.message} : error in delete photo`);
		req.flash('error_message' , ' حذف نشد دوباره تلاش کنید ');
		next(new Error('error in delete news'));
	}
};

exports.contactUs = async (req , res ,next)=>{
	try {
		const contact = await contactUs.findAndSortAll();
		res.render('page/media/contact_us' , {contact});
	} catch (error) {
		next(new Error('error in get contact us'));
	}

};

exports.allUser = async (req, res, next) => {
	try {
		// const limit = 10 ;
		const page = req.query.page || 1 ;
		const user = await User.findType(null , page , limit );
		const userCount = await User.findCount();
		res.render('page/user/all_user', { 
			user ,
			limit, 
			current : parseInt(page) ,
			pages : Math.ceil(userCount / limit) });
	} catch (e) {
		debug(`${e.message} : error in get all user`);
		next(new Error('error in get all user'));
	}
};
exports.managersUser = async (req, res, next) => {
	try {
		// const limit = 10 ;
		const page = req.query.page || 1 ;
		const user = await User.findType(managers_type , page , limit );
		const userCount = await User.findCount(managers_type);
		res.render('page/user/base_user', {
			title : text.title_manager_user ,
			tableTitle : text.tableTitle_manager_user ,
			user ,
			limit, 
			current : parseInt(page) ,
			pages : Math.ceil(userCount / limit)});
	} catch (e) {
		debug(`${e.message} : error in get manager user`);
		next(new Error('error in get manager user'));
	}
};
exports.normalUser = async (req, res, next) => {
	try {
		// const limit = 10 ;
		const page = req.query.page || 1 ;
		const user = await User.findType(normal_type  , page , limit );
		const userCount = await User.findCount(normal_type);
		res.render('page/user/base_user', {
			title : text.title_normal_user , 
			tableTitle : text.tableTitle_normal_user, 
			user ,
			limit, 
			current : parseInt(page) ,
			pages : Math.ceil(userCount / limit)});
	} catch (e) {
		debug(`${e.message} : error in get manager user`);
		next(new Error('error in get manager user'));
	}
};
exports.userBlock = async(req , res , next)=>{
	try {
		const flag = req.params.flag === 'false'?  false : true ;
		await User.findByIdAndUpdate(req.params.id , { $set : { isBlock : flag}} );
		//  just for now
		res.redirect('/panel/managers_user');	
	} catch (error) {
		debug(`${error.message} : error in block  user`);
		next(new Error('error in block user'));
	}
	
};
exports.deleteUser = async (req ,res ,next)=>{
	try {
		await User.findByIdAndRemove(req.params.id);
		res.redirect('/panel/managers_user');
	} catch (error) {
		debug(`${error.message} : error in delete user`);
		next(new Error('error in delete user'));
	}

};
exports.getAddManager = (req ,res , next)=>{
	res.render('page/manager/add_manager');
};
exports.addManager = async (req , res ,next)=>{
	const {user_name , full_name , email , password} = req.body ;
	try{
		const result = joi.validate({user_name, password, email , full_name} , managerSchemaValid );
		if(result.error !== null){
			debug('invalid input user');
			req.flash('error_message' ,`${result.error.details[0].context.label} ‍`);
			res.redirect('/panel/add_manager');
		}else{
			const user = await User.register(user_name, password, email ,managers_type , full_name);
			if(user){
				debug('user Created');
				req.flash('success-message' , `" ${full_name} " با موفقیت ساخته شد `);
				res.redirect('/panel/add_manager');
			}else{
				debug('failed to register user');
				req.flash('error_message' , `" ${full_name} " ساخته نشد `);
				res.redirect('/panel/add_manager');
	
			}
		}

	}catch(e){
		debug(` ${e.message }error in save manager`);
		req.flash('error_message' , 'نام کاربری یا ایمیل موجود است : نام دیگری انتخاب کنید');
		res.redirect('/panel/add_manager');
		// next(new Error('error in save manager'));
	}
};
exports.logout = (req , res , next)=>{
	res.cookie('auth', '');	
	res.redirect('/panel/login');
};
