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
    switch(req.header('accept')){
     case 'application/json' :


        try{
            let teachers = await Teacher.fetchTeachers();
            teachers = Function.parseForSelect(teachers);
            let users = await User.fetchUsers();
            console.log(users);
        return res.json(teachers);
        }catch(e){
            console.log(e);
        return res.sendStatus(INTERNAL_SERVER_ERROR);            
        }
        break;
     case 'text/html' :
       return res.render('ajax/teacher',{'teacher':'data'});
       break;
    }
    console.log("Unhandled request header at handlers/teacher.js");
    return res.sendStatus(NOT_IMPLEMENTED);

});
router.get('/:id', async (req,res)=>{
    if(req.header('accept') == 'application/json'){
        /*
        * send teacher data in json format 
        */
       try{
            let teacher = await Teacher.fetchTeachers({'_id': req.params.id});
        return res.json(teacher);
        }catch(e){
            console.log(e)
            return res.status(INTERNAL_SERVER_ERROR).json({'res':'err'});
        }
    }else if(req.header('accept') == 'text/html'){
            /* 
            *   send teacher data in txt for rendering
            **/
    return res.send("html data for id :"+id);
    }
});

router.post('/', async (req,res)=>{
    console.log(req.headers.accept);
    if(req.header('accept') == 'application/json'){
        /*
        *   save the teacher in the database
        *  */
        return res.send("save teacher");
    }else if(req.header('accept') == 'text/html'){
        /* 
        *   render the create teacher form
        *  */
        return res.send("create teacher form");
    }
    console.log("Unhandled request header at handlers/teacher.js");
    return res.send("Sever header occurred");
});
router.put('/', async (req,res)=>{
    let _id = req.body._id;
    let teacher = await Teacher.fetchTeachers({'_id':_id},['subject','department']);
    let departments = await Department.fetchDepartments();
    departments = Function.parseForSelect(departments);
    let designations = await Designation.fetchDesignations();
    designations = Function.parseForSelect(designations);
    return res.render('ajax/teacher',{'teacher':teacher[0],'departments':departments,'designations':designations});
});
router.delete('/', async (req,res)=>{
    if(req.header('accept') == 'application/json'){
        /* 
        *   delete the teacher
        *  */
        return res.send("delete teacher server");
    }else if(req.header('accept') == 'text/html'){
        return res.send("text/html");
    }
    console.log("Unhandled request header at handlers/teacher.js");
    return res.send("Sever header occurred");
});

router.patch('/', async (req,res)=>{
    /* 
    *   Testing route
    *  */
    res.download('./public/Express 4.x - API Reference.pdf');
});

module.exports = router;