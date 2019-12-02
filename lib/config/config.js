require('dotenv').config();

const config =  {
	port : process.env.PORT ,
	mongo_host : process.env.MONGO_HOST ,
	secret_token : process.env.SECRET_TOKEN,
	expiresIn_token : process.env.EXPIRESIN_TOKEN,
	normal_type : process.env.NORMAL_TYPE,
	managers_type : process.env.MANAGERS_TYPE,
	secret_session : process.env.SECRET_SESSION,
	photo_type	:	process.env.PHOTO_TYPE ,
	movie_type	:	process.env.MOVEI_TYPE,
	domain	:	process.env.DOMAIN,
	book_type : process.env.BOOK_TYPE

};

module.exports = config;