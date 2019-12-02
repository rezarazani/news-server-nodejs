const http = require('http');
const Routes = require('./routes/index');
const Init = require('./lib/utils/Init');
const {secret_session , port} = require('./lib/config/config');
const {plussOne , checkType , paginate , select  , checkCategory} = require('./lib/helper/handelbars_helper');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const debug = require('debug')('nahad:SERVER');
const app = express();

app.server = http.createServer(app);

// view engine setup

app.use(morgan('dev'));
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));

app.use(session({
	secret: secret_session ,
	resave: false, 
	saveUninitialized: false
}));

app.set('views' , path.join(__dirname , 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'index' , helpers : {plussOne , checkType , paginate , select , checkCategory}}));
app.set('view engine', 'handlebars');
//initializing

Init(app);
Routes(app);


app.server.listen(port || 3000, () => {
	debug(`server is listening on port  ${app.server.address().port}`);
});

module.exports = app;