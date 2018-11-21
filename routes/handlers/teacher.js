const express = require('express'),
    router = express.Router(),
    ObjectId = require('mongoose').Types.ObjectId,
    Designation = require('../../models/designation'),
    Subject = require('../../models/subject'),
    User = require('../../models/user'),
    Department = require('../../models/department'),
    Teacher= require('../../models/teacher'),
    Function = require('../../functions');
const INTERNAL_SERVER_ERROR = 500, NOT_IMPLEMENTED = 501;

router.get('/', async (req,res)=>{
    try{
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
        
            let user = await User.fetchUserById(_id,{'populate':[{'path':'designation','select':'name'}],'select':'-password -rank'});
            let teacher = await Teacher.fetchTeacherById(user.profile,[{'path':'department','select':'name'},{'path':'subject','select':'name'}]);
            teacher = teacher.toObject();
            delete student._id;
        let departments = await Department.fetchDepartments(),
            designations = await Designation.fetchDesignations();
            departments = Function.parseForSelect(departments);
            designations = Function.parseForSelect(designations);
    return res.render('student/create',{'student':{...user.toObject(),...teacher},"update":true,'designations':designations,'departments':departments});
    }catch(e){
        console.log(e);
        return res.json({'errors':[{'location':'params','msg':'Can not fetch user   '}]});
    }
});







router.get('/:_id', async (req,res)=>{
    try{
        let _id = req.params._id;
        if(!_id)
            return res.json([{'location':'params','msg':'ObjectId required'}]);
        if(!ObjectId.isValid(_id))
            return res.json([{'location':'params','msg':'Invalid ObjectId'}]);
            let user = await User.fetchUserById(_id,{'populate':[{'path':'designation','select':'name'}],'select':'-password -rank'});
            let teacher = await Teacher.fetchTeacherById(user.profile,{populate:[{'path':'subject','select':'name'},{'path':'department','select':'name'}]});
            console.log(user);
            console.log(teacher);
        return res.render('teacher/profile',{'teacher':{...user.toObject(),...teacher.toObject()}});
    }catch(e){
        return res.send(e);
    }
});
router.get('/update', async (req, res)=>{
    return res.send("Update");
});
router.post('/', async (req,res)=>{
    try{
        let teacher = new Teacher({
            'name':req.body.name,
            'department':req.body.department,
            'email':req.body.email,
            'subject':req.body.subject,
            'class':req.body.class
        });
        teacher = await Teacher.createTeacher(teacher);
        let user = new User({
            'username':req.body.username,
            'designation':req.body.designation,
            'rank':'teacher',
            'password':'1234',
            'name':req.body.name,
            'profile':teacher._id
        });
        user = await User.createUser(user);
        return res.json(user);
    }catch(e){
        console.log(e);
        return res.sendStatus(INTERNAL_SERVER_ERROR);
    }
});
router.put('/', async (req,res)=>{
    try{
        if(req.header('accept') === 'application/json'){
            let _id = req.body._id;
            let user = await User.fetchUserById(_id),
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
        return res.json(user);
        }         
        let _id = req.body._id;
        let user = await User.fetchUserById({_id});
        let teacher = await Teacher.fetchTeacherById(user.profile,['subject','department']);
        let departments = await Department.fetchDepartments();
        let designations = await Designation.fetchDesignations();
        departments = Function.parseForSelect(departments);
        designations = Function.parseForSelect(designations);
        return res.render('ajax/teacher',{layout:null, 'teacher':teacher,'user':user,'departments':departments,'designations':designations});
    }catch(e){
        console.log(e);
        return res.sendStatus(INTERNAL_SERVER_ERROR);
    }
});
router.delete('/', async (req,res)=>{
    if(req.header('accept') == 'application/json'){
        try{
            let user = await User.fetchUserById(req.body._id);
            let teacher = await Teacher.fetchTeacherById(user.profile);
            let result = await User.delete(user._id) & await Teacher.delete(teacher._id);
            return res.json(result);
        }catch(e){
            console.log(e);
            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }else if(req.header('accept') == 'text/html'){
        return res.send("text/html");
    }
    console.log("Unhandled request header at handlers/teacher.js");
    return res.sendStatus(INTERNAL_SERVER_ERROR);
});
router.patch('/', async (req,res)=>{
    let departments= await Department.fetchDepartments({},{select:'name'});
    return res.send(departments);
});

function _throw(e){
    throw Function.pushError(e);
}
module.exports = router;