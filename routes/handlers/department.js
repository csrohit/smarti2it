const Department = require('../../models/department'),
    Function = require('../../functions'),
    router = require('express').Router();



router.get('/', async (req,res)=>{
    try{
        let departments = await Department.fetchDepartments();
        departments = Function.parseForSelect(departments);
        return res.render('general/list',{'items':departments,'h2':'Departments','link':'department'});
    }catch(e){
        return res.send(e);
    }
});
router.get('/update', async (req, res)=>{
    return res.send("Update");
});
module.exports = router;