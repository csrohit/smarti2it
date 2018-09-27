const express = require('express'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        exphbs = require('express-handlebars'),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        result = require('dotenv').config(),
        Handlebars = require('handlebars'),
        flash = require('connect-flash'),
        app = express(),
        routes = require('./routes/index'),
        users = require('./routes/users'),
        api = require('./routes/api'),
        ajax = require('./routes/ajax'),
        node = require('./routes/node');
        admin = require('./routes/admin');

// LOAD ENV FILE
if (result.error) {
    console.log("error loading env file"+result.error);
}

// Connect to database
mongoose.connect(process.env.DB_HOST+"/"+process.env.DB_NAME, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('connected', function () {
    console.log('Connected to Database');
});
db.on('error', function (error) {
    console.log('Could not Connect to database');
    console.log(error);
});

// connect flash
app.use(flash());
// view engine
app.engine('handlebars',exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Express session
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}));
app.use(passport.initialize());
app.use(passport.session());

//Routing
app.use('/',(req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || "";
    if ((req.url.indexOf('/vendors/') === -1) && req.url.indexOf('/resources/') === -1 )
        console.log(req.method + " request was made at " + req.url);
    next();
});
app.use(express.static('public'));
app.use('/users',users);
app.use('/',routes);
app.use('/api',api);
app.use('/ajax',ajax);
app.use('/admin',admin);
app.use('/node',node);
app.use(function(req, res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

app.listen(process.env.PORT,()=>{
    console.log("Server started on port " + process.env.PORT);
});

// Custom Helpers
Handlebars.registerHelper('ifCond', function (v1,v2,options) {
    if (v1 == v2)
        return options.fn(this);
    else
        return options.inverse(this);
});
Handlebars.registerHelper('exCond', function (v1,v2,options) {
    if (v1 != v2)
        return options.fn(this);
    else
        return options.inverse(this);
});
