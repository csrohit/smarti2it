const express = require('express'),
    router = express.Router(),
    passport=require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user'),
    Student = require('../models/student'),
    Teacher = require('../models/teacher'),
    Subject = require('../models/subject'),
    Class = require('../models/class'),
    Department = require('../models/department');

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
        console.log("User not found");
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

/*      Routes      */
router.use('/',isLoggedIn,(req,res,next)=>{
   next();
});
router.get('/login',(req,res)=>{
    res.render('auth/login', {title: "Login | Moodle"});
});
router.post('/login',passport.authenticate('rohit',{
    failureRedirect: '/users/login',
    successRedirect : '/users/dashboard',
    failureFlash: true

}));
router.get('/dashboard',(req,res)=>{
    res.render('users/dashboard',{title:"Dashboard | Moodle"});
})
router.get('/profile',async (req,res)=>{
    try {
        let user = await User.get(req.user.username,['profile.profile','designation']);
        let profile;
        if (user.profile.kind === 'Student'){
            profile = await Student.fetchStudent({_id:user.profile.profile},['department']);
            res.render('profile/student',{profile:profile,designation:user.designation});
        }
        else{
            profile = await Teacher.fetchTeacher({_id:user.profile.profile},['department','subject']);
            console.log(profile);
            res.render('profile/teacher',{profile:profile,designation:user.designation});
        }

    }catch (e) {
        res.send(e);
    }
});
router.get('/logout',  (req, res) => {
    req.logout();
    if (req.headers.referer === 'http://localhost:3000/users/pwd')
        req.flash('success_msg','Password has been changed successfully');
    else
        req.flash('success_msg', "You have been logged out");
    res.redirect('/users/login');
});

/*      User defined Functions      */
function isLoggedIn(req,res,next){
    if (req.isAuthenticated() && req.url === '/login') {
        return res.redirect('/users/dashboard');
    } else if (req.isAuthenticated() || req.url==='/apilogin' || req.url === '/login') {
        return next();
    } else
        return res.redirect('/users/login');
}

module.exports = router;