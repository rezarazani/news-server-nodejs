const express = require('express');
const router = express.Router();
const controller = require('../lib/controllers/news_controller');
const {mainGuard} = require('../lib/utils/guard').guard ;

router.all('/*', mainGuard() ,(req , res , next)=>{
	next();
});

router.post('/find_all' , controller.findAll);
router.post('/find_by_category' , controller.findByCategory);
router.get('/find_by_id/:id' , controller.findNewsById);
router.get('/get_slider_news' , controller.getSliderNews);
router.post('/book_mark' , controller.bookMark);
router.post('/search_news' , controller.searchNews);
router.get('/show_movie/:id', controller.showMovie);

module.exports = router ;