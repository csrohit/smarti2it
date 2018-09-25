const express = require('express'),
        router = express.Router(),
        Designation = require('../models/designation'),
        Subject = require('../models/subject'),
        Department = require('../models/department'),
        Teacher= require('../models/teacher');



router.get('/create-user',(req,res)=>{
    res.render('auth/register');
});
router.get('/subject',(req,res)=>{
    res.render('ajax/subject',{layout:null});
});
router.get('/create-teacher',async (req,res)=>{
    try {
        let designations = await Designation.fetchDesignations(),
            subjects = await Subject.fetchSubjects(),
            departments = await Department.fetchDepartments();
            designations = parseForSelect(designations);
            subjects = parseForSelect(subjects);
            departments = parseForSelect(departments);
        res.render('ajax/teacher',{layout:null,designations:designations,subjects:subjects,departments:departments});
    }
    catch (e) {
        console.log("Error occurred");
        res.send(e);
    }
});
router.get('/create-department',(req,res)=>{
   res.render('ajax/department',{layout:null});
});
router.get('/create-student',async (req,res)=>{
    try {
        let designations = await Designation.fetchDesignations(),
            departments = await Department.fetchDepartments();
        designations = parseForSelect(designations);
        departments = parseForSelect(departments);
        res.render('ajax/student',{layout:null,designations:designations,departments:departments});
    }
    catch (e) {
        console.log("Error occurred");
        res.send(e);
    }
});
router.get('create-timetable',(req,res)=>{
   res.render('ajax/timetable',{layout:null});
})
router.get('/create-office',(req,res)=>{
    res.render('ajax/office',{layout:null});
});
router.get('/create-lab',(req,es)=>{
   res.render('ajax/lab',{layout:null});
});
router.get('/create-designation',(req,res)=>{
   res.render('ajax/designation',{layout:null});
});
router.get('/create-class', async (req,res)=>{
    let departments = await Department.fetchDepartments();
        departments = parseForSelect(departments);
        res.render('ajax/class',{layout:null,departments:departments})
});
router.get('/get-teachers',async (req,res)=>{
  let department = req.query.department;
  let teachers = await Teacher.fetchTeachers({department:department});
  teachers = parseForSelect(teachers);
  res.json(teachers);

});
router.get('/get-subjects',async (req,res)=>{
    let subjects = await Subject.fetchSubjects();
    subjects = parseForSelect(subjects);

   res.send(subjects);
});
router.delete('/subject', async (req,res)=>{
    try {
        if (await Subject.delete(req.body.id))
            return res.send(true);      // deleted at least one element
        else return res.send(false);
    }catch (e) {
        return res.send(false);         // if failed to delete the subject
    }
});
module.exports = router;

// User defined functios
function parseForSelect(source){
    let len = source.length,
        result = [];
    for (let i=0;i<len;i++){
        let designation = source[i];
        let obj = {
            name:designation.name,
            value:designation._id
        };
        result.push(obj);
    }
    return result;
}