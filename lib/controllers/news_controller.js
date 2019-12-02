const News = require('../dao/news_dao');
const fs = require('fs');
const Media = require('../dao/multimedia_dao');
const debug = require('debug')('nahad:News_controller');
// تا زمانی که وارد نشدن هیچ خبری به جز خبر های درجه 2 دریافت نمیکنن 
exports.findAll = async (req, res, next) => {
	try {
		const { page, limit } = req.body;
		const {account_type } = req.credentianls ;
		const news = await News.findPageAndLimit(page , limit , account_type);			
		res.json(Object.assign(req.base, {
			message: 'Successful',
			data: {news}
		}));
	} catch (e) {
		debug(`${e.mcountessage} : error in get massage`);
		next(new Error('error in get massage'));
	}
};
exports.findByCategory = async (req, res, next) => {
	try {
		const { category, page, limit } = req.body;
		const { account_type } = req.credentianls ;
		const news = await News.findPageAndLimit(page , limit , account_type , category);
		const totalCount = await News.findCountCategry(category);
		res.json(Object.assign(req.base, {
			message: 'Successful',
			data: {news  , totalCount } 
		}));
	} catch (e) {
		debug(`${e.message} : error in get massage by category`);
		next(new Error('error in get massage by category'));
	}
};
exports.findNewsById = async (req, res, next) => {
	try {
		const { account_type } = req.credentianls ;
		const news = await News.findByIds(req.params.id);
		news.related = await News.findRelated(news , account_type);
		res.json(Object.assign(req.base, {
			message: 'Successful',
			data: news
		}));
	} catch (e) {
		debug(`${e.message} : error in get massage by id`);
		next(new Error('error in get massage by id'));
	}
};
exports.getSliderNews = async (req , res ,next)=>{
	try {
		const { account_type } = req.credentianls ;
		const news = await News.findSlider(account_type);
		res.json(Object.assign(req.base, {
			message: 'Successful',
			data: {news}
		}));
	} catch (e) {
		debug(`${e.message} : error in get massage slider`);
		next(new Error('error in get massage slider'));
	}
};
exports.bookMark = async (req , res , next)=>{
	try {
		const { id , page , limit} = req.body;
		debug(`${id}  : bookMark`);
		debug(`${typeof JSON.parse(id)}  : bookMark type`);
		const ids = JSON.parse(id);
		const bookMark = await News.findBookMarkIds(ids , page , limit);
		const totalCount = await News.findBookMarkIdsCount(ids);
		res.json(Object.assign(req.base , {
			message : 'Successful',
			data : { bookMark , totalCount }
		}));
	} catch (error) {
		debug(`${error.message} : error in get Book mark `);
		next(new Error('error in get Book mark'));		
	}
	
};
exports.searchNews = async (req , res ,next)=>{
	const {phrase , page , limit} = req.body ;
	debug(`${phrase} : phrase`);	
	const { account_type } = req.credentianls ;
	const search=  await News.searchNews(phrase ,page , limit , account_type);
	const totalCount = await News.searchNewsCount(phrase , account_type);


	console.log("search result : " , search);
	res.json(Object.assign(req.base , {
		message : 'Successful' ,
		data : {search , totalCount }
	}));
};
exports.showMovie = async (req , res , next )=>{

	const media = await Media.findById(req.params.id);
	const path = 'public/'+ media.media ;

	const stat = fs.statSync(path);
	const fileSize = stat.size;
	const range = req.headers.range;

	if (range) {
		const parts = range.replace(/bytes=/, '').split('-');
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
	
		const chunksize = (end-start)+1;
		const file = fs.createReadStream(path, {start, end});
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
			// 'Content-Type': 'application/octet-stream'

		};
	
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		};
		res.writeHead(200, head);
		fs.createReadStream(path).pipe(res);
	}
};

