const User = require('../../models/user'),
    Subject = require('../../models/subject'),
    Function = require('../../functions'),
    router = require('express').Router();


router.get('/', async (req,res)=>{
    /* 
    *   List of all users
    *  */
    try{
        let users = await User.fetchUsers();
        console.log(users);
        users = Function.parseForSelect(users);
    return res.send(users);
    }catch(e){
        console.log(e);
    }
    return res.sendStatus(400);
});
router.get('/:id', async (req,res)=>{
    /* 
    *   list specific user
    */
   try{
        let users = await User.fetchUsers({'_id':req.params.id});
        console.log(users);
        users = Function.parseForSelect(users);
    return res.send(users);
    }catch(e){
        console.log(e);
    }
    return res.sendStatus(400);
});
router.post('/', async (req,res,next)=>{
    let user = {
        'name':req.body.name,
        
    }
});
module.exports = router;