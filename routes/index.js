const express = require('express'),
    router = express.Router();



router.get('/',(req,res)=>{
    res.render('static/home',{title:"Home| Moodle"});
});

router.get('/queries',  (req, res)=>{
    res.render('queries', {title:"Queries | Moodle"});
});
router.get('/check',  (req, res)=>{
    res.render('test');
});
router.get('/test',  (req, res)=>{
    res.send("My name is rohit");
});



module.exports = router;