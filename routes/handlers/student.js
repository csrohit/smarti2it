const express = require('express'),
    router = express.Router(),
    ObjectId = require('mongoose').Types.ObjectId,
    Designation = require('../../models/designation'),
    Subject = require('../../models/subject'),
    User = require('../../models/user'),
    Department = require('../../models/department'),
    Teacher= require('../../models/teacher'),
    Student= require('../../models/student'),
    err = require('../../err'),
    Function = require('../../functions'),
    validator = require('express-validator');


router.get('/', async (req, res)=>{
    try{
        let students = await User.fetchUsers({'rank':'student'},{select:'name'});
        return res.render('student/list',{'students':students});
    }catch(e){
        return res.send(e);
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
        let student = await Student.fetchStudentById(user.profile,[{'path':'department','select':'name'}]);
        student = student.toObject();
        delete student._id;
        let departments = await Department.fetchDepartments({},{select:'name'}),
            designations = await Designation.fetchDesignations({},{select:'name'});
    return res.render('student/create',{'student':{...user.toObject(),...student},"update":true,'designations':designations,'departments':departments});
    }catch(e){
        console.log(e);
        return res.json({'errors':[{'location':'params','msg':'Can not fetch user   '}]});
    }
});
router.get('/create', async (req, res)=>{
    try{
        let departments = await Department.fetchDepartments({},{select:'name'}),
            designations = await Designation.fetchDesignations({},{select:'name'});
    return res.render('student/create',{'designations':designations,'departments':departments});
    }catch(e){
        console.log(e);
        return res.json({'errors':[{'location':'params','msg':'Can not fetch student create form'}]});
    }
});
/* to be put at last */
router.get('/:_id', async (req,res)=>{
    try{
        let _id = req.params._id;
        if(!_id)
            return res.json([{'location':'params','msg':'ObjectId required'}]);
        if(!ObjectId.isValid(_id))
            return res.json([{'location':'params','msg':'Invalid ObjectId'}]);
        let user = await User.fetchUserById(_id,{'populate':[{'path':'designation','select':'name'}],'select':'-password -rank'});
        let student = await Student.fetchStudentById(user.profile,{'populate':[{'path':'department','select':'name'}]});
        student = student.toObject();
        delete student._id;
        return res.render('student/profile',{'student':{...user.toObject(),...student}});
    }catch(e){
        return res.send(e);
    }
});
router.put('/', async (req, res)=>{
    try{
        req.checkBody('name','Name field required').notEmpty().matches(/^([a-zA-Z]+\s?)?([a-zA-Z]+)$/g).withMessage('Invalid name');
        req.checkBody('email','email field required').notEmpty().isEmail().matches(/@isquareit.edu.in?$/g).withMessage("Invalid Email");
        req.checkBody('username','username field required').notEmpty().matches(/^[a-zA-Z0-9.\w]+$/g).withMessage("Invalid username");
        req.checkBody('roll_no','Roll no. field required').notEmpty().isInt({min:1,max:85}).withMessage("Invalid Roll no");
        req.checkBody('department','Department field required').notEmpty().isMongoId().withMessage('Invalid department Id');
        req.checkBody('designation','Designation field required').notEmpty().isMongoId().withMessage('Invalid designation Id');
        // req.checkBody('designation','Class field required').notEmpty().isMongoId().withMessage('Invalid class Id');
        const errors = req.validationErrors(true);        
        let departments = await Department.fetchDepartments({},{select:'name'}),
        designations = await Designation.fetchDesignations({},{select:'name'});
        if(errors){
            return res.render('student/create',{'errors':errors,"update":true,'data':req.body,'designations':designations,'departments':departments});
        }
        let _id = req.body._id;
        let user = await User.fetchUserById(_id,{'select':'-password -rank'}),
        student = await Student.fetchStudentById(user.profile);
        let set = new Object();

        let name = req.body.name,
        designation = req.body.designation,
        username = req.body.username,
        department = req.body.department,
        email = req.body.email,
        roll_no = req.body.roll_no;

        {(user.name == name)?'':set['name'] = name;}
        {(user.designation == designation)?'':set['designation'] = designation;}
        {(user.username == username)?'':set['username'] = username;}                    
        user = await User.update(_id,set);                    
        set={};
        {(student.name == name)?'':set['name'] = name;}
        {(student.email == email)?'':set['email'] = email;}
        {(student.roll_no == roll_no)?'':set['roll_no'] = roll_no;}
        {(student.department == department)?'':set['department'] = department;}
        student = await Student.update(student._id,set);
        req.flash('success_msg','Student updated successfully');
        return res.send('200');
        }catch(e){
        return res.send(e);
    }
});
router.post('/', async (req, res)=>{
    try{
        req.checkBody('name','Name field required').notEmpty().matches(/^([a-zA-Z]+\s?)?([a-zA-Z]+)$/g).withMessage('Invalid name');
        req.checkBody('email','email field required').notEmpty().isEmail().matches(/@isquareit.edu.in?$/g).withMessage("Invalid Email");
        req.checkBody('username','username field required').notEmpty().matches(/^[a-zA-Z0-9.\w]+$/g).withMessage("Invalid username");
        req.checkBody('roll_no','Roll no. field required').notEmpty().isInt({min:1,max:85}).withMessage("Invalid Roll no");
        req.checkBody('department','Department field required').notEmpty().isMongoId().withMessage('Invalid department Id');
        req.checkBody('designation','Designation field required').notEmpty().isMongoId().withMessage('Invalid designation Id');
        // req.checkBody('designation','Class field required').notEmpty().isMongoId().withMessage('Invalid class Id');
        const errors = req.validationErrors(true);        
        if(errors){
            let departments = await Department.fetchDepartments({},{select:'name'}),
                designations = await Designation.fetchDesignations({},{select:'name'});
            return res.render('student/create',{'errors':errors,'data':req.body,'designations':designations,'departments':departments});
        }
        // validation complete create user
        let name = req.body.name,
            email = req.body.email,
            username = req.body.username,
            roll_no = req.body.roll_no,
            department = req.body.department,
            designation = req.body.designation,
            classs = req.body.classs;
            let student = new Student({
                'name':name,
                'email':email,
                'roll_no':roll_no,
                'department':department,
                'classs':classs
            });
            // console.log(student);
        student = await Student.createStudent(student);
        if(!student){
            return res.send('student not created');
        }
        let user = new User({
            'name':name,
            'password':'1234',
            'username':username,
            'designation':designation,
            'profile':student._id,
            'rank':'student'
        });
        user = await User.createUser(user);
        if(!user){
            console.log('here');
        }
        req.flash('success_msg',"User created successfully");
        return res.redirect('/student');
    }catch(e){
        // return res.send(e);
        console.log(e);
        req.flash('error_msg','Operation failed');
        return res.redirect('/student');
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
        let student = await Student.fetchStudentById(user.profile,{select:'_id'});
        if(!student){
            req.flash('error_msg','Unable to find Student');
            return res.send("not deleted");
        }
        let result = await Student.delete(student._id) && await User.delete(user._id);
        if(!result){
            req.flash('error_msg','Unable to delete user and  Student');
            return res.send("not deleted");
        }
        console.log(student);
        req.flash('success_msg',"User deleted successfully");
        return res.send('200');
    }catch(e){
        console.log(e);
        req.flash('error_msg','Unable to delete Student');
        return res.send("not deleted");
    }
});
router.patch('/', async (req,res)=>{
    try{
        // let user = await User.fetchUserWithFields('5bf31e7ce523043bb7e3ca62',{'select':['designation','name'],'populate':[{'path':'designation','select':['name','permissions']}]});
        // return res.send(user);
        let user = await User.fetchUserById('5beec4dc01a810402dd8df1e',{'populate':[{'path':'designation','select':'name'}],'select':'-password -rank'});
        return res.send(user);
        

        /* 
        
        
            (id, {populate:[],fields:[]})
        
        */


    }catch(e){
        return res.send(e);
    }

    

});

function _throw(e){
    throw Function.pushError(e);
}
module.exports = router;