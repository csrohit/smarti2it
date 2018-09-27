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
