const Department = require('../../models/department'),
    Function = require('../../functions'),
    router = require('express').Router();



router.get('/', async (req,res)=>{
    switch(req.header('accept')){
        case 'application/json' :
            let departments = await Department.fetchDepartments();
            departments = Function.parseForSelect(departments);
            return res.json(departments);
        break;
    }
});
module.exports = router;