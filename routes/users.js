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

/* passport.use('rohit', new LocalStrategy( async (username,password,done)=>{
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
 */
/*      Routes      */
// router.use('/',isLoggedIn,(req,res,next)=>{
//    next();
// });
router.get('/login',(req,res)=>{
    res.render('auth/login', {title: "Login | Moodle"});
});
router.post('/login',passport.authenticate('rohit',{
    failureRedirect: '/user/login',
    successRedirect : '/user/dashboard',
    failureFlash: true
}));
router.get('/logout',  (req, res) => {
    req.logout();
    if (req.headers.referer === 'http://localhost:3000/users/pwd')
        req.flash('success_msg','Password has been changed successfully');
    else
        req.flash('success_msg', "You have been logged out");
    res.redirect('/user/login');
});
router.get('/dashboard',(req,res)=>{
    res.render('user/dashboard');
})
router.get('/profile',async (req,res)=>{
    try {
        let user = await User.fetchUserById(req.user._id,{populate:[{'path':'designation'}],select:'-password'});
        if(user.rank === 'teacher'){
            let teacher = await Teacher.fetchTeacherById(user.profile,{'populate':[{'path':'department','select':'name'},{'path':'subject','select':'name'}]});
            teacher = teacher.toObject();
            delete teacher._id;
            return res.render('teacher/profile',{'teacher':{...user.toObject(),...teacher}});
        }
        let student = await Student.fetchStudentById(user.profile,{'populate':[{'path':'department','select':'name'}]});
        student = student.toObject();
        delete student._id;
        return res.render('student/profile',{'student':{...user.toObject(),...student}});
    }catch (e) {
        res.send(e);
    }
});



module.exports = router;