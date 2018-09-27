const express = require('express'),
    router = express.Router(),
    Designation = require('../../models/designation'),
    Subject = require('../../models/subject'),
    Department = require('../../models/department'),
    Teacher= require('../../models/teacher');

router.get('/',async (req,res)=>{
    let teachers = await Teacher.fetchTeachers();
    res.render('ajax/subject',{layout:null});
});
router.delete('/', async (req,res)=>{
    try {
        if (await Subject.delete(req.body.id))
            return res.send(true);                  // deleted at least one element
        else return res.send(false);
    }catch (e) {
        return res.send(false);                     // if failed to delete the subject
    }
});
router.put('/',(req,res)=>{
    let data = req.body
});
router.post('/',(req,res)=>{
    let subject = new  Subject({
        name: req.body.name,
        university_code:req.body.university_code
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
