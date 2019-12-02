const express = require('express');
const router  = express.Router();


const controller = require('../lib/controllers/contact_us_controller');

router.post('/send_message_for_us' , controller.sendMessageForUs);

module.exports = router ;
