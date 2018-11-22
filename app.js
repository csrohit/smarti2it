const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    exphbs = require('express-handlebars'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    result = require('dotenv').config(),
    // Handlebars = require('handlebars'),
    flash = require('connect-flash'),
    validator = require('express-validator'),
    LocalStrategy = require('passport-local').Strategy,
    routes = require('./routes/index'),
    users = require('./routes/users'),
    api = require('./routes/api/api'),
    ajax = require('./routes/ajax'),
    node = require('./routes/node'),
    User = require('./models/user'),
    admin = require('./routes/admin'),
    teacher = require('./routes/handlers/teacher'),
    subject = require('./routes/handlers/subject'),
    department = require('./routes/handlers/department'),
    designation = require('./routes/handlers/designation'),
    helpers = require('./lib/helpers'),
    student = require('./routes/handlers/student');


// LOAD ENV FILE
if (result.error) {
    console.log("error loading env file"+result.error);
}
// Connect to database
mongoose.connect(process.env.DB_HOST+'/'+process.env.DB_NAME, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('connected', function () {
    console.log('Connected to Database');
});
db.on('error', function (error) {
    console.log('Could not Connect to database');
    console.log(error);
});
let hbs = exphbs.create({
    defaultLayout:'main',
    helpers:helpers
})
app.use(flash());
app.engine('handlebars',hbs.engine);
app.set('view engine','handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(validator());
app.use(express.json());
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use('rohit', new LocalStrategy( async (username,password,done)=>{
    try {
        let user = await User.fetchByUsername(username),
            isMatch = await User.comparePassword(password,user.password);
            if (isMatch){
                return done(null,user);
            }
            else{
                return done(null,false,{message:"Invalid Password"});
            }
    }catch (e) {
        console.log(e);
        return done(null,false,{message:"unknown user"});
    }
}));
passport.serializeUser((user, done) =>{
    done(null, user.id);
});
passport.deserializeUser( async (id, done) => {
    try {
        let user = await User.fetchUserById(id);
        done(null,user);
    }catch (e) {
        done(e);
    }
});
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
app.use('/api',api);
app.use('/',routes);
app.use('/',isLoggedIn,(req,res,next)=>{
    next();
 });
app.use('/user',users);
app.use('/teacher',teacher);
app.use('/student',student);
app.use('/department',department);
app.use('/subject',subject);
app.use('/ajax',ajax);
app.use('/admin',admin);
app.use('/designation',designation);
app.use('/node',node);
app.use(function(req, res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

app.listen(process.env.PORT,()=>{
    console.log("Server started on port " + process.env.PORT);
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated() && req.url === '/user/login') {
        return res.redirect('/users/dashboard');
    } else if (req.isAuthenticated() || req.url==='/apilogin' || req.url === '/user/login') {
        return next();
    } else
        req.flash('error_msg','you must login first')
        return res.redirect('/user/login');
}