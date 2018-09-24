const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const departmentSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    faculty:[{
        type: Schema.Types.ObjectId,
        ref:'Teacher'
    }],
    subjects:[{
        type:Schema.Types.ObjectId,
        ref:'Subject'
    }],
    classes:[{
        type:Schema.Types.ObjectId,
        ref:'Class'
    }],
    head:{
        type:Schema.Types.ObjectId,
        ref:'Teacher'
    },
    labs:[{
        type:Schema.Types.ObjectId,
        ref:'Lab'
    }],
    offices:[{
        type:Schema.Types.ObjectId,
        ref:'Office'
    }]
});

const Department = module.exports = mongoose.model('Department',departmentSchema);

module.exports.createDepartment = newDepartment=>{
  return new Promise((resolve,reject)=>{
      newDepartment.save((err,newDepartment)=>{
          if (err)reject("Error creating department "+err);
          else resolve(newDepartment);
      })
  })
};
module.exports.fetchDepartments = ()=>{
  return new Promise((resolve,reject)=>{
     Department.find({},(err,departments)=>{
         if (!err)resolve(departments);
         else reject(err);
     })
  });

};