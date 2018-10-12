const express = require('express'),
    router = express.Router(),
    ObjectId = require('mongoose').Types.ObjectId,
    Designation = require('../../models/designation'),
    Subject = require('../../models/subject'),
    Department = require('../../models/department'),
    Teacher= require('../../models/teacher'),
    Function = require('../../functions');
router.get('/', async (req,res)=>{
    console.log(req.headers.accept);
    if (req.headers.accept === 'application/json'){
        /*
        * send teachers data in json format
        * */
        let field = Object.keys(req.query)[0],
            id = req.query[field],
            query = {};
        if (id != new ObjectId(id)){
            /*
            * Invalid objectId
            * Handle the condition
            * */
            return res.send("Invalid object id");
        }
        query[field] = id;
        let teachers = await Teacher.fetchTeachers(query);
        teachers = Function.parseForSelect(teachers);
        return res.send(teachers);

    }else if (req.headers.accept === 'text/html'){
        /*
        * send create teacher form view with populated fields
        * */
    }
    console.log("Unhandled request header at handlers/teacher.js");
    return res.send("server error occurred");

});



module.exports = router;