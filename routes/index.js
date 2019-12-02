const User = require('./User');
const Panel= require('./panel');
const News = require('./News');
const Contact = require('./contact');
const Views = require('../lib/dao/ views_dao') ;

module.exports = app => {
	app.use('/user' , User);
	app.use('/panel' , Panel);
	app.use('/news' , News);
	app.use('/contact' , Contact);
	app.all('/' , async (req, res) => {
		await Views.saveViews();
		res.sendFile('index.html', {root: './build'});
	});
	app.all('/newslist/*' , (req, res) => {
		res.sendFile('index.html', {root: './build'});
	});
	app.all('/news/*' , (req, res) => {
		res.sendFile('index.html', {root: './build'});
	});
	app.all('/register' , (req, res) => {
		res.sendFile('index.html', {root: './build'});
	});
	app.all('/login' , (req, res) => {
		res.sendFile('index.html', {root: './build'});
	});

	app.all('/searchResult' , (req, res) => {
		res.sendFile('index.html', {root: './build'});
	});
};