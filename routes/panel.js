const express = require('express');
const router  = express.Router();
const controller = require('../lib/controllers/panel_controller');
const multer = require('multer');
const serveIndex	= require('serve-index');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads/');
	},
	filename: function (req, file, cb) {
		const type = (file.originalname).match(/\.[0-9a-z]{1,5}$/);
		cb(null, file.fieldname + '_' + Date.now()+ type);
	}
});
const upload = multer({ storage: storage });

const {panelGuard} = require('../lib/utils/guard').guard;

router.get('/login', controller.login);
router.post('/sign_in', controller.signIn);
router.use('/ftp' , express.static(path.join(__dirname , '../public')) , serveIndex(path.join(__dirname , '../public') , {'icons' : true} ));

router.all('/*' , panelGuard ,(req , res , next)=>{
	req.app.locals.layout = 'index';
	next();
});


router.get('/', (req,res)=>{res.redirect('/panel/main');});
router.get('/main', controller.mainPage);
router.get('/ViewsCount', controller.ViewsCount);
router.get('/NorAndManViewsCount', controller.NorAndManViewsCount);
router.get('/allViewsCount', controller.allViewsCount);
router.get('/categoryChar', controller.categoryChar);


router.get('/all_news', controller.allNews);
router.get('/managers_news', controller.managersNews);
router.get('/normal_news', controller.normalNews);
router.get('/my_news', controller.myNews);
router.get('/send_news', controller.creatNews);
router.post('/send_news', upload.single('img'), controller.sendNews);
router.get('/send_news_pic', controller.creatNewsPic);
router.post('/send_news_pic',upload.single('pic'), controller.sendNewsPic);
router.get('/send_news_mov', controller.creatNewsMov);
router.post('/send_news_mov',upload.single('film'), controller.sendNewsMov);
router.get('/send_news_book', controller.creatNewsBook);
const cpUpload = upload.fields([{ name: 'img', maxCount: 1 }, { name: 'book', maxCount: 1 }]);
router.post('/send_news_book',cpUpload, controller.sendNewsBook);


router.get('/delete_news/:id', controller.deleteNews);

router.get('/photo', controller.getPhoto);
router.get('/delete_photo/:id', controller.deletePhoto);

router.get('/movie', controller.getMovie);
router.get('/delete_movie/:id', controller.deleteMovie);

router.get('/contact_us' , controller.contactUs);


router.get('/all_user', controller.allUser);
router.get('/managers_user', controller.managersUser);
router.get('/normal_user', controller.normalUser);
router.get('/user/block/:flag/:id' , controller.userBlock);
router.get('/delete_user/:id' , controller.deleteUser);


router.get('/add_manager', controller.getAddManager);
router.post('/add_manager', controller.addManager);

router.get('/logout' , controller.logout);

module.exports = router ;