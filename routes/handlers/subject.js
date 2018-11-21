const express = require('express'),
    router = express.Router(),
    ObjectId = require('mongoose').Types.ObjectId,
    Designation = require('../../models/designation'),
    Subject = require('../../models/subject'),
    Department = require('../../models/department'),
    Teacher= require('../../models/teacher'),
    Function = require('../../functions');

const INTERNAL_SERVER_ERROR = 500, NOT_IMPLEMENTED = 501;
router.get('/',async (req,res)=>{
    let subjects = await Subject.fetchSubjects();
    subjects = Function.parseForSelect(subjects);
    return res.render('subject/list',{'subjects':subjects});
});
router.get('/:_id', async (req,res)=>{
    try{
        let _id = req.params._id;
        if(!_id)
            return res.json([{'location':'params','msg':'ObjectId required'}]);
        if(!ObjectId.isValid(_id))
            return res.json([{'location':'params','msg':'Invalid ObjectId'}]);
        let subject = await Subject.fetchSubjectById(_id,['teacher','department']);
        console.log(subject);
        return res.render('subject/profile',{'subject':subject});
    }catch(e){

    }


/*     try{
        let subject = await Subject.fetchSubject({'_id':req.params._id},['department']);
        return res.json(subject);
    }catch(e){
        console.log(e);
        return res.sendStatus(INTERNAL_SERVER_ERROR);
    } */

});
router.get('/update', async (req, res)=>{
    return res.send("Update");
});













router.delete('/', async (req,res)=>{
    /*
    * Get the id of the subject to be deleted from the form body and delete the subject
    * */

    try {
        if (await Subject.delete(req.body.id))
            return res.send(true);                  // deleted at least one element
        else return res.send(false);
    }catch (e) {
        return res.send(false);                     // if failed to delete the subject
    }
});
router.put('/', async (req, res)=>{
    try{
        if(req.header('accept')=='application/json'){
            let _id = req.body._id,
            subject = await Subject.fetchSubjectById(_id),
            department = req.body.department,
            university_code = req.body.university_code,
            teacher = req.body.teacher,
            name = req.body.name;
            let set = new Object();
            {(subject.name === name)?'':set['name']=name;}
            {(subject.teacher === teacher)?'':set['teacher']=teacher;}
            {(subject.department === department)?'':set['department']=department;}
            {(subject.university_code === university_code)?'':set['university_code']=university_code;}
            subject = await Subject.update(subject._id,set);
            return res.sendStatus(200);
        }
        let _id = req.body._id;
        let subject = await Subject.fetchSubjectById({'_id':_id}),
            departments = await Department.fetchDepartments();
            departments = Function.parseForSelect(departments);
        return res.render('ajax/subject',{layout:null,'subject':subject,'departments':departments});
    }catch(e){
        console.log(e);
        return res.sendStatus(INTERNAL_SERVER_ERROR);
    }
});
router.post('/',(req,res)=>{
    let subject = new  Subject({
        name: req.body.name,
        university_code:req.body.university_code,
        department : req.body.department
    });
    Subject.createSubject(subject)
        .then(subject=>{
            return res.send(subject);
        })
        .catch(e=>{
            console.log(e)
            return res.send("error occured on server");
        });
});
router.patch('/',(req,res)=>{
   return res.send("Subject patch route");
});
module.exports = router;
