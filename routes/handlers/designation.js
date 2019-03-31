const Designation = require('../../models/designation'),
    Function = require('../../lib/functions'),
    router = require('express').Router();

router.get('/', async (req, res)=>{
    try{
        let designations = await Designation.fetchDesignations();
        designations = Function.parseForSelect(designations);
        return res.render('general/list',{'items':designations,'h2':'Designations','link':'designation'});
    }catch(e){
        return res.send(e);
    }
});

router.get('/update', async (req, res)=>{
    return res.send("Update");
});


module.exports = router;