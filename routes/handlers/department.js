const Department = require('../../models/department'),
    Function = require('../../functions'),
    ObjectId = require('mongoose').Types.ObjectId,
    router = require('express').Router();



router.get('/', async (req,res)=>{
    try{
        if(req.header('accept') === 'application/json'){
            let departments = await Department.fetchDepartments({},{select:'name'});
            return res.json(departments);
        }
        let departments = await Department.fetchDepartments({},{select:'name'});
        return res.render('general/list',{'items':departments,'h2':'Departments','route':'department'});
    }catch(e){
        return res.send(e);
    }
});
router.get('/create', (req, res)=>{
    return res.render('department/create');
});
router.get('/update/:_id', async (req, res)=>{
    try{
        let _id = req.params._id,
            department = await Department.fetchDepartmentById(_id);
            if(!department){
                req.flash('error_msg','Department does not exist');
                return res.redirect('/department');
            }
            return res.render('department/create',{'update':true,'department':department});
    }catch(e){
        console.log(e);
        req.flash('error_msg','Department does not exist');
        return res.redirect('/department');
    }
});
router.get('/:_id', async (req, res)=>{
    try{
        req.checkParams('_id','Invalid department Id').notEmpty().isMongoId();
        const errors = req.validationErrors(true);
        if(errors){
            req.flash('error_msg','Invalid Object Id');
            return res.redirect('/department');
        }
        let _id = req.params._id,
            department = await Department.fetchDepartmentById(_id,{'populate':[{'path':'teacher','select':'name'}]});
        if(!department){
            req.flash('error_msg','Department does not exist');
            return res.redirect('/department');
        }
        return res.render('department/profile',{'department':department});
    }catch(e){
        console.log(e);
        return res.send(e);
    }
});
router.post('/', async (req, res)=>{
    req.checkBody('name','Name field required').notEmpty().matches(/^([a-zA-z]+\s?)+[a-zA-z]+$/g).withMessage('Invalid department name');
    let name = req.body.name;
    /* Other validations to be added */
    const errors = req.validationErrors(true);
    if(errors){
        return res.render('department/create',{'errors':errors,'data':req.body});
    }
    // no validation errors, save thedepartment
    let department = new Department({
        'name':name
    });
    department = await Department.create(department);
    if(!department){
        req.flash('error_msg','Failed to create Department');
        return res.redirect('/department');
    }
    req.flash('success_msg','Department created successfully');
    return res.redirect('/department');
});
router.put('/', async (req, res)=>{
    try{
        let _id = req.body._id;
        if(!_id || !ObjectId.isValid(_id)){
            req.flash('error_msg','Invalid ObjectId');
            return res.send('400');
        }
        let department = await Department.fetchDepartmentById(_id);
        if(!department){            
            req.flash('error_msg','Department does not exist');
            return res.send('400');
        }
        req.checkBody('name','Name field required').notEmpty().matches(/^([a-zA-z]+\s?)+[a-zA-z]+$/g).withMessage('Invalid department name');
        let name = req.body.name;
        /* Other validations to be added */
        const errors = req.validationErrors(true);
        if(errors){
            return res.render('department/create',{'errors':errors,'data':req.body});
        }
        let set = new Object();
        {department.name === name?'':set['name']=name};
        let result =await Department.update(_id,set);
        return res.send(result);
    }catch(e){
        console.log(e);
        req.flash('error_msg','Error occurred check log for details');
        return res.send('400');
    }
});
module.exports = router;