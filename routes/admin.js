const express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    Subject = require('../models/subject'),
    Designation = require('../models/designation'),
    Department = require('../models/department'),
    Teacher = require('../models/teacher'),
    Student = require('../models/student');

// CPanel
router.get('/cp',(req,res)=>{
    res.render('admin/cp',{title: "CP | Moodle"});
});

// Database operations
router.post('/create-subject',(req,res)=>{
    let subject = new  Subject({
        name: req.body.name,
        university_code:req.body.university_code
    });
    Subject.createSubject(subject)
        .then(subject=>{
            res.send(subject);
        })
        .catch(e=>console.log(e));
});
router.post('/create-designation',(req,res)=>{
    console.log(req.body);
    let designation = new Designation({
        name:req.body.name,
        permissions:req.body.permissions
    });
    Designation.createDesignation(designation)
       .then(designation=>res.json(designation))
       .catch(e=>console.log(e));
});
router.post('/create-department',async (req,res)=>{
    let department = new Department({
       name:req.body.name
    });
    department = await Department.createDepartment(department);
    res.json(department);

});
router.post('/create-teacher',async (req,res)=>{
   try {
       let teacher = new Teacher({
           name:req.body.name,
           email:req.body.email,
           subject:req.body.subject,
           department:req.body.department
       });
       teacher = await Teacher.createTeacher(teacher);
       let user = new User({
           username : req.body.username,
           designation:req.body.designation,
           password: '1234',
           name:req.body.name,
           profile: {
               kind: 'Teacher',
               profile: teacher._id
           }
       });
       user = await User.createUser(user);
       res.send(teacher+user);
   }catch (e) {
       res.send(e);
       console.log("Error occurred /ajax/create-teacher");
   }
});
router.post('/create-student',async (req,res)=>{
   try {
       let student = new Student({
           name:req.body.name,
           email:req.body.email,
           roll_no:req.body.roll_no,
           department:req.body.department
       });
       student = await Student.createStudent(student);
       let user = new User({
           username : req.body.username,
           designation:req.body.designation,
           password: '1234',
           name:req.body.name,
           profile: {
               kind: 'Student',
               profile: student._id
           }
       });
       user = await User.createUser(user);
       res.send(student+user);
   }catch (e) {
       res.send(e);
       console.log("Error occurred /admin/create-user "+e);
   }
});
router.post('/create-class', async (req,res)=>{

})





//Debug
router.patch('/test',async (req,res)=>{
res.send("patch success full");
});




module.exports = router;