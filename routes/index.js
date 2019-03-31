const express = require('express'),
    router = express.Router(),
    nodemailer = require('nodemailer'),
    Handlebars = require('express-handlebars').create({layoutsDir:'./views/static'});



router.get('/',(req,res)=>{
    res.render('static/home',{title:"Home| Moodle"});
});

router.get('/queries',  (req, res)=>{
    res.render('queries', {title:"Queries | Moodle"});
});
router.get('/check',  (req, res)=>{
   Handlebars.render('./test.handlebars',{'name':'Rohit Nimkar'})
    .then(data=>{
        return res.send(data);
    })
    .catch(e=>{return res.send(e)});
});
router.get('/test',async(req,res)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'rohitnimkarme@gmail.com',
               pass: 'Mysite_#12398'
           }
       });
       let html = await Handlebars.precompile('static/home');
       console.log(html);
       const mailOptions = {
        from: 'rohitnimkarme@gmail.com', // sender address
        to: 'nehalnimkar@gmail.com', // list of receivers
        subject: 'Nodemailer', // Subject line
        html: '<h1>testing the gmail transport serviice of nodemailer</h1>'// plain text body
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          return res.send(err);
        else
          return res.send(info);
     });
});



module.exports = router;
