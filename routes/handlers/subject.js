const express = require('express'),
    router = express.Router(),
    ObjectId = require('mongoose').Types.ObjectId,
    Designation = require('../../models/designation'),
    Subject = require('../../models/subject'),
    Department = require('../../models/department'),
    Teacher= require('../../models/teacher'),
    validator = require('express-validator'),
    Function = require('../../functions');

const INTERNAL_SERVER_ERROR = 500, NOT_IMPLEMENTED = 501;
router.get('/',async (req,res)=>{
    try{
        if(req.header('accept') === 'application/json'){
            req.checkQuery('department','Department field required').notEmpty().isMongoId().withMessage('Invalid department ObjectId');
            const errors = req.validationErrors(true);
            if(errors){
                return res.send(errors);
            }
            let subjects = await Subject.fetchSubjects({'department':req.query.department},{select:'name'});
            return res.send(subjects);
        }
        let subjects = await Subject.fetchSubjects({},{select:'name'});
        return res.render('subject/list',{'subjects':subjects});
    }catch(e){
        console.log(e);
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
        let subject = await Subject.fetchSubjectById(_id,{'populate':[{'path':'department','select':'name'}]});
        let departments = await Department.fetchDepartments({},{select:'name'}),
            teachers = await Teacher.fetchTeachers({},{select:'name'});
    return res.render('subject/create',{'subject':subject,"update":true,'teachers':teachers,'departments':departments});
    }catch(e){
        console.log(e);
        return res.json({'errors':[{'location':'params','msg':'Can not fetch subject'}]});
    }
});
router.get('/create', async (req, res)=>{
    try{

        let departments = await Department.fetchDepartments({},{select:'name'}),
            teachers = await Teacher.fetchTeachers({},{select:'name'});
            return res.render('subject/create',{'departments':departments,'teachers':teachers});
    }catch(e){
        console.log(e);
        req.flash('error_msg','error occurred check log for details');
        return res.redirect('/subject');
    }
})
router.get('/:_id', async (req,res)=>{
    try{
        let _id = req.params._id;
        if(!_id)
            return res.json([{'location':'params','msg':'ObjectId required'}]);
        if(!ObjectId.isValid(_id))
            return res.json([{'location':'params','msg':'Invalid ObjectId'}]);
        let subject = await Subject.fetchSubjectById(_id,{'populate':[{'path':'teacher',select:'name'},{path:'department',select:'name'}]});
        return res.render('subject/profile',{'subject':subject});
    }catch(e){
        console.log(e);
        return res.json({'errors':[{'location':'params','msg':'Can not fetch subject'}]});
    }
});
router.delete('/', async (req,res)=>{
    try {
        console.log(req.body._id);
        let _id = req.body._id;
        if(!_id || !ObjectId.isValid(_id)){
            console.log("invakid ojectid");
            req.flash('error_msg','Invalid ObjectId');
            return res.send('200');
        }
        let result = await Subject.delete(req.body.id)
        console.log(result);
        if (result){
            console.log("deleted");
            req.flash('success_msg','Subject deleted successfully');
            return res.send('200');
        }
        else {
            console.log("not deleted");
            req.flash('error_msg','No subject deleted');
            return res.send('200');
        }
    }catch (e) {
        console.log(e);
        req.flash('error_msg','No subject deleted');
        return res.send(false);                     // if failed to delete the subject
    }
});
router.put('/', async (req, res)=>{
    try{
        let _id = req.body._id;
        if(!_id || !ObjectId.isValid(_id)){
            req.flash('error_msg','Invalid ObjectId');
            return res.redirect('/subject');
        }
        let subject = await Subject.fetchSubjectById(_id,{'populate':[{path:'department',select:'name'},{path:'teacher',select:'name'}]})
        if(!subject){            
            req.flash('error_msg','subject does not exist');
            return res.redirect('/subject');
        }
        req.checkBody('name','Name field is required').notEmpty().matches(/^([a-zA-Z]+\s?)+([a-zA-Z]+)$/g).withMessage('Invalid name');
        req.checkBody('department','Department field required').notEmpty().isMongoId().withMessage('Invalid department Id');
        req.checkBody('teacher','Teacher field required').notEmpty().isMongoId().withMessage('Invalid teacher Id');
        req.checkBody('university_code','SPPU code field is required').notEmpty().isInt({min:1000,max:2000}).withMessage('Invalid SPPU code');
        const errors = req.validationErrors(true);
        let departments = await Department.fetchDepartments({},{select:'name'}),
            teachers = await Teacher.fetchTeachers({},{select:'name'});
        if(errors){
            return res.render('subject/create',{'subject':subject,'update':true,'errors':errors,'teachers':teachers,'departments':departments})
        }
        let department = req.body.department,
            university_code = req.body.university_code,
            teacher = req.body.teacher,
            name = req.body.name;
        let set = new Object();
        {(subject.name === name)?'':set['name']=name}
        {(subject.teacher === teacher)?'':set['teacher']=teacher}
        {(subject.department === department)?'':set['department']=department}
        {(subject.university_code === university_code)?'':set['university_code']=university_code}
        subject = await Subject.update(subject._id, set);
        req.flash('success_msg','Subject updated successfully');
        return res.send('200');
    }catch(e){
        console.log(e);
        req.flash('error_msg','Unable to find subject');
        return res.send('400');
    }
});
router.post('/', async(req,res)=>{
    try{    
        req.checkBody('name','Name field is required').notEmpty().matches(/^([a-zA-Z]+\s?)+([a-zA-Z]+)$/g).withMessage('Invalid name');
        req.checkBody('department','Department field required').notEmpty().isMongoId().withMessage('Invalid department Id');
        // req.checkBody('teacher','Teacher field required').notEmpty().isMongoId().withMessage('Invalid teacher Id');
        req.checkBody('university_code','SPPU code field is required').notEmpty().isInt({min:1000,max:2000}).withMessage('Invalid SPPU code');
        let subject = new  Subject({
            name: req.body.name,
            university_code:req.body.university_code,
            department : req.body.department
        });
        subject = await Subject.createSubject(subject);
        req.flash('success_msg','Subject created successfully');
        return res.redirect('/subject/'+subject._id);
    }catch(e){
        console.log(e);
        req.flash('error_msg','Unable to create student');
        return res.redirect('/student/create');
    }
});
module.exports = router;
