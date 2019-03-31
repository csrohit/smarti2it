const express = require('express'),
    router = express.Router(),
    Designation = require('../models/designation'),
    Subject = require('../models/subject'),
    Department = require('../models/department'),
    subject = require('./handlers/subject');
Teacher= require('../models/teacher');


router.post('/',(req,res)=>{
    console.log("Data received from : "+req.connection.remoteAddress);
   console.log(req.body);
   console.log('\n');
   res.sendStatus(200);
});
module.exports = router;