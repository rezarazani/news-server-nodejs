const joi = require('joi');
module.exports = {
	userSchemaValid : joi.object().keys({
		user_name : joi.string().min(3).max(20).required(),
		password  : joi.string().min(5).max(20).required(),
		email  : joi.string().email()
	}),
	managerSchemaValid :joi.object().keys({
		user_name : joi.string().min(3).max(20).required().label('مقدار نامتعبر : اندازه نام کاربری باید بین 3 تا 20 کارکتر باشد '),
		password  : joi.string().min(5).max(20).required().label('مقدار نامتعبر : اندازه پسورد باید بین 5 تا 20 کارکتر باشد '),
		email  : joi.string().email().label('مقدار نامتعبر : ایمیل شما نامعتبر است '),
		full_name : joi.string().min(3).label('مقدار نامتعبر : اندازه نام شما باید بیش از  3 کارکتر باشد ')
	}),
	newsSchemaValid : joi.object().keys({
		title : joi.string().min(3).max(45).required().label('مقدار نامتعبر : اندازه عنوان باید بین 3 تا 45 کارکتر باشد '),
		description : joi.string().min(5).max(170).required().label('مقدار نامتعبر : اندازه توضیحات باید بین 5 تا 170 کارکتر باشد '),
		text_tag : joi.string().min(20).required().label('مقدار نامتعبر : اندازه خبر حداقل 20 کارکتر باشد '),
		text : joi.string().required(),
		tag : joi.string().min(3).max(100).label('tag length').label('مقدار نامتعبر : اندازه برچسب ها باید بین 3 تا 100 کارکتر باشد ')
	}),
	picSchemaValid : joi.object().keys({
		title : joi.string().min(3).max(20).required().label('مقدار نامتعبر : اندازه عنوان باید بین 3 تا 20 کارکتر باشد '),
		description : joi.string().min(5).max(50).required().label('مقدار نامتعبر : اندازه توضیحات باید بین 5 تا 50 کارکتر باشد '),
	}),
	ContactUsSchema : joi.object().keys({
		title : joi.string().required(),
		text : joi.string().required() 
	})
};