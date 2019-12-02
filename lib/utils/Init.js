module.exports = app => {
	app.use((req, res, next) => {
		res.setHeader('Access-control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Autherization');
		res.setHeader('Access-Control-Expose-Headers', '');
		next();
	});

	app.use((req, res, next) => {

		req.base = {
			result: true,
			message: '',
			data: {}
		};
		next();
	});

	app.use((req,res,next)=>{
		

		// res.locals.old = req.flash('old');
		res.locals.success_message = req.flash('success-message');
		res.locals.error_message   = req.flash('error_message');
		// req.flash('old', req.body);
		next();
	});
	
};