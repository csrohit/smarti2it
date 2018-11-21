const express = require('express'),
    router = express.Router(),
    ObjectId = require('mongoose').Types.ObjectId,
    Designation = require('../../models/designation'),
    Subject = require('../../models/subject'),
    User = require('../../models/user'),
    Department = require('../../models/department'),
    Teacher= require('../../models/teacher'),
    validator = require('express-validator'),
    Function = require('../../functions');
const INTERNAL_SERVER_ERROR = 500, NOT_IMPLEMENTED = 501;

router.get('/', async (req,res)=>{
    try{
        if(req.header('accept') === 'application/json'){
            req.checkQuery('department','Department field required').notEmpty().isMongoId().withMessage('Invalid department ObjectId');
            const errors = req.validationErrors(true);
            if(errors){
                return res.send(errors);
            }
            let result = await Teacher.fetchTeachers({'department':req.query.department},{select:'name'});
            return res.send(result);
        }
       let teachers = await User.fetchUsers({'rank':'teacher'},{select:'name'});
       return res.render('teacher/list',{'teachers':teachers})
    }catch(e){
        res.send(e);
    }
});
router.get('/update/:_id', async (req, res)=>{
    try{
        let _id = req.params._id;
        if(!_id)
            return res.json([{'location':'params','msg':'ObjectId required'}]);
        if(!ObjectId.isValid(_id))
            return res.json([{'location':'params','msg':'Invalid ObjectId'}]);        
            let user = await User.fetchUserById(_id,{'select':'-password -rank'});
            let teacher = await Teacher.fetchTeacherById(user.profile);
            teacher = teacher.toObject();
            delete teacher._id;
        let departments = await Department.fetchDepartments({},{'populate':[{'path':'department','select':'name'}],select:'name'}),
            subjects = await Subject.fetchSubjects({'department':teacher.department._id},{select:'name'}),
            designations = await Designation.fetchDesignations({},{select:'name'});
    return res.render('teacher/create',{'teacher':{...user.toObject(),...teacher},"update":true,'designations':designations,'subjects':subjects,'departments':departments});
    }catch(e){
        console.log(e);
        return res.json({'errors':[{'location':'params','msg':'Can not fetch user   '}]});
    }
});
router.get('/create', async (req, res)=>{
    try{
        let departments = await Department.fetchDepartments({},{select:'name'}),
            designations = await Designation.fetchDesignations({},{select:'name'});
    return res.render('teacher/create',{'designations':designations,'departments':departments});
    }catch(e){
        console.log(e);
        return res.json({'errors':[{'location':'params','msg':'Can not fetch student create form'}]});
    }
});
router.get('/:_id', async (req,res)=>{
    try{
        let _id = req.params._id;
        if(!_id || !ObjectId.isValid(_id)){
            req.flash('error_msg','Invalid ObjectId');
            return res.redirect('/teacher');
        }
        let user = await User.fetchUserById(_id,{'populate':[{'path':'designation','select':'name'}],'select':'-password -rank'});
        let teacher = await Teacher.fetchTeacherById(user.profile,{'populate':[{'path':'department','select':'name'},{'path':'subject','select':'name'}]});
        teacher = teacher.toObject();
        delete teacher._id;
        return res.render('teacher/profile',{'teacher':{...user.toObject(),...teacher}});
    }catch(e){
        console.log(e);
        return res.send(e);
    }
});
router.post('/', async (req,res)=>{
    try{
        req.checkBody('name','Name field required').notEmpty().matches(/^([a-zA-Z]+\s?)?([a-zA-Z]+)$/g).withMessage('Invalid name');
        req.checkBody('email','email field required').notEmpty().isEmail().matches(/@isquareit.edu.in?$/g).withMessage("Invalid Email");
        req.checkBody('username','username field required').notEmpty().matches(/^[a-zA-Z0-9.\w]+$/g).withMessage("Invalid username");
        req.checkBody('department','Department field required').notEmpty().isMongoId().withMessage('Invalid department Id');
        req.checkBody('subject','Subject field required').notEmpty().isMongoId().withMessage('Invalid subject Id');
        req.checkBody('designation','Designation field required').notEmpty().isMongoId().withMessage('Invalid designation Id');
        let departments = await Department.fetchDepartments({},{select:'name'}),
            subjects = await Subject.fetchSubjects({},{select:'name'}),
            designations = await Designation.fetchDesignations({},{select:'name'});
        const errors = req.validationErrors(true);        
        if(errors){
            return res.render('teacher/create',{'errors':errors,'data':req.body,'designations':designations,'subjects':subjects,'departments':departments});
        }


        let teacher = new Teacher({
            'name':req.body.name,
            'email':req.body.email,
            'department':req.body.department,
            'subject':req.body.subject,
            'class':req.body.class
        });
        teacher = await Teacher.createTeacher(teacher);
        let user = new User({
            'name':req.body.name,
            'username':req.body.username,
            'designation':req.body.designation,
            'rank':'teacher',
            'password':'1234',
            'profile':teacher._id
        });
        user = await User.createUser(user);
        req.flash('success_msg',"User created successfully");
        return res.redirect('/teacher');
    }catch(e){
        console.log(e);
        req.flash('error_msg','Operation failed');
        return res.redirect('/teacher');
    }
});
router.put('/', async (req,res)=>{
    try{        
        let  _id = req.body._id;
        if(!_id || !ObjectId.isValid(_id)){
            req.flash('error_msg','Invalid ObjectId');
            return res.redirect('/teacher');
        }
        // req.checkBody('_id','ObjectId field required').notEmpty().isMongoId().withMessage('Invalid ObjectId');
        req.checkBody('name','Name field required').notEmpty().matches(/^([a-zA-Z]+\s?)?([a-zA-Z]+)$/g).withMessage('Invalid name');
        req.checkBody('email','email field required').notEmpty().isEmail().matches(/@isquareit.edu.in?$/g).withMessage("Invalid Email");
        req.checkBody('username','username field required').notEmpty().matches(/^((\_?[a-z]+\.?)+\_?)+$/g).withMessage("Invalid username");
        req.checkBody('department','Department field required').notEmpty().isMongoId().withMessage('Invalid department Id');
        req.checkBody('designation','Designation field required').notEmpty().isMongoId().withMessage('Invalid designation Id');
        req.checkBody('subject','Subject field required').notEmpty().isMongoId().withMessage('Invalid subject Id');
        // req.checkBody('classs','Class field required').notEmpty().isMongoId().withMessage('Invalid class Id');
        const errors = req.validationErrors(true);        
        let departments = await Department.fetchDepartments({},{select:'name'}),
        designations = await Designation.fetchDesignations({},{select:'name'});
        if(errors){
            return res.render('student/create',{'errors':errors,"update":true,'data':req.body,'designations':designations,'departments':departments});
        }
        let user = await User.fetchUserById(_id,{'select':'-password -rank'}),
        teacher = await Teacher.fetchTeacherById(user.profile);
        let set = new Object();

        let name = req.body.name,
        designation = req.body.designation,
        username = req.body.username,
        department = req.body.department,
        email = req.body.email,
        subject = req.body.subject;

        {(user.name == name)?'':set['name'] = name;}
        {(user.designation == designation)?'':set['designation'] = designation;}
        {(user.username == username)?'':set['username'] = username;}                    
        user = await User.update(_id,set);                    
        set={};
        {(teacher.name == name)?'':set['name'] = name;}
        {(teacher.department == department)?'':set['department'] = department;}
        {(teacher.subject == subject)?'':set['subject'] = subject;}
        {(teacher.email == email)?'':set['email'] = email;}
        teacher = await Teacher.update(teacher._id,set);
        req.flash('success_msg','Teacher update successfully');
        return res.send('200');
    }catch(e){
        console.log(e);
        return res.sendStatus(INTERNAL_SERVER_ERROR);
    }
});
router.delete('/', async (req, res)=>{
    try{
        req.checkBody('_id','User Id required').notEmpty().isMongoId().withMessage('Invalid userId');
        let errors = req.validationErrors(true);
        if(errors){
            req.flash('error_msg','Unable to delete Student');
            return res.send("not deleted");
        }
        let user = await User.fetchUserById(req.body._id,{'select':'profile'});
        if(!user)
        {
            req.flash('error_msg','Unable to find user');
            return res.send("not deleted");
        }
        let teacher = await Teacher.fetchTeacherById(user.profile,{select:'_id'});
        if(!teacher){
            req.flash('error_msg','Unable to find Teacher');
            return res.send("not deleted");
        }
        // console.log(user);/*  */
        let result = await Teacher.delete(teacher._id) && await User.delete(user._id);
        if(!result){
            req.flash('error_msg','Unable to delete user and  Teacher');
            return res.send("not deleted");
        }
        // console.log(student);
        req.flash('success_msg',"User deleted successfully");
        return res.send('200');
    }catch(e){
        // console.log(e);
        req.flash('error_msg','Unable to delete Teacher');
        return res.send("not deleted");
    }
});
router.patch('/', async (req,res)=>{
    let departments= await Department.fetchDepartments({},{select:'name'});
    return res.send(departments);
});

function _throw(e){
    throw Function.pushError(e);
}
module.exports = router;