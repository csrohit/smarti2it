const express = require('express'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    User = require('../../models/user'),
    router = express.Router(),
    userRoute = require('./user');
// ststus codes
const UNAUTHORISED = 401, BADREQUEST = 400, FORBIDDEN = 403;

router.use('/', async (req, res, next)=>{
    //  verify the tocken for all routes except login route
    if(req.url == '/' && req.method == 'POST')
        return next();
    try{
        let token = req.headers['authorization'];
        var decoded = await jwt.verify(token, 'aass');
        return next();
    }catch(e){
        console.log(e);
        return res.sendStatus(401);
    }
});

router.get('/', async (req, res)=>{
    return res.json({'res':'connected'});
});

router.post('/', async (req,res)=>{
    // find user in the database
    try{
        let user = await User.fetchByUsername(req.body.username),
        isMatch = await User.comparePassword(req.body.password, user.password);
        if(!isMatch)
            return res.json({'res':UNAUTHORISED});
        user.password = null;
        //  Authentication successfull, sign the token with userdata
        let token = await jwt.sign(JSON.stringify(user),'aass');
        return res.json({'token':token});
    }catch(e){
        console.log(e);
        return res.sendStatus(401);
    }
    res.sendStatus(BADREQUEST);
});
router.use('/user',userRoute);

module.exports = router;