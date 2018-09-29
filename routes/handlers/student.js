const express = require('express'),
    router = express.Router(),
    Designation = require('../../models/designation'),
    Subject = require('../../models/subject'),
    Department = require('../../models/department'),
    Teacher= require('../../models/teacher');

router.get('/',async (req,res)=>{
    /*
    * Fetch the data from the database to be populated in the student creation form
    * and render the view along with the parsed data for the select field
    * */
    let teachers = await Teacher.fetchTeachers();
    res.render('ajax/subject',{layout:null});
});
router.get('/view',(req,res)=>{
    /*
    * Get the Subject from the database with given id and populate the required field
    * render the subject profile view with data
    * */
    return res.send("Subject profile view");
});
router.get('/update',(req,res)=>{
    /*
    * Get the subject to be updated from the database and render the subject create
    * form along with the pre-dilled subject form data
    * */
    return res.send("get update form route");
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
router.put('/',async (req,res)=>{
    /*
    * Get the required data-fields about the subject and validate
    * update the subject in the database here.....
    * */
    try {
        let data = req.body,
            id = req.body._id,
            name = data.name;
        let result = await Subject.update({'_id':id,'name':name});
        return res.send(result);
    }catch (e) {
        console.log(e);
        return res.send("Server error occurred");
    }
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
