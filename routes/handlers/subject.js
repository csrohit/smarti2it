const express = require('express'),
    router = express.Router(),
    Designation = require('../../models/designation'),
    Subject = require('../../models/subject'),
    Department = require('../../models/department'),
    Teacher= require('../../models/teacher'),
    Function = require('../../functions');

router.get('/',async (req,res)=>{
   if (req.headers.accept === 'application/json'){
       /*
       * Send the object array parsed for table  display
       * */
        let query = req.query.department;
        let subjects=null;
        if(query)
            subjects = await Subject.fetchSubjects({'department':query});            
        else
        subjects = await Subject.fetchSubjects();            
       console.log(subjects);
       subjects = Function.parseForSelect(subjects);
       return res.send(subjects);
   }else if (req.headers.accept === 'text/html'){
           /*
           * send subject create view form
           * */
            try {
                let departments = await Department.fetchDepartments();
                departments = Function.parseForSelect(departments);
                return res.render('ajax/subject',{layout:null,departments:departments});
            }catch (e) {
                console.log(e);
                return res.send("Server error occurred");
            }
   }

    console.log("Unknown header for subject get handlers/subject.js");
    return res.send('Unhandled request');
});
router.get('/:id', async (req,res)=>{
   let id = req.params.id;
   console.log(req.headers.accept);
   if (req.headers.accept === 'application/json'){
       /*
       * Send subject data as json
       * */
       return res.send("Subject data in json for "+id);
   } else if (req.headers.accept === 'text/html'){
       /*
       * Send subject data as text/html for rendering
       * */
       return res.send("Subject profile view for "+id);
   }
   console.log("Unknown header for subject id request handlers/subject.js");
   return res.send('Unhandled request');
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
    try {
        if (req.headers.accept === 'application/json'){
            /*
            * process the update request here
            * */
                let data = req.body,
                    id = req.body._id,
                    name = data.name,
                    result = await Subject.update({'_id':id,'name':name});
                return res.send(result);
        }
        else if (req.headers.accept === 'text/html'){
            /*
            * Send update form
            *
            * */
                let id = req.body._id,
                    subject = await Subject.fetchSubject({_id:id}),
                    departments = await Department.fetchDepartments();
                departments = Function.parseForSelect(departments);
            return res.render('ajax/subject',{layout:null,subject:subject,departments:departments});
        }
    }catch (e) {
        console.log(e);
        return res.send("Server error occurred");
    }
    console.log("Unknown header for update handlers/subject.js");
    return res.send('Unhandled request');
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
