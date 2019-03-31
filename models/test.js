const Subject = require('./subject'),
    mongoose = require('mongoose'),
    Class = require('./class'),
    Department=require('./department');


mongoose.connect('mongodb://localhost:27017/moodle',{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('connected', function () {
    console.log('Connected to Database');
});
db.on('error', function (error) {
    console.log('Could not Connect to database');
    console.log(error);
});


/*      testing area    */

var department = new Department({
   name:"Electronics & telecommunications"
});
Department.createDepartment(department)
    .then(department=>{
        console.log(department);
    })
    .catch(e=>console.log(e));
