const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const designationSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    permissions:[{
        type: String,
        required: true
    }]
});

const Designation = module.exports = mongoose.model('Designation',designationSchema);

// methods
module.exports.createDesignation = newDesignation=>{
  return new Promise((resolve,reject)=>{
      newDesignation.save((err,newDesignation)=>{
          if (err)reject("Error creating designation "+err);
          else resolve(newDesignation);
      })
  })
};
module.exports.fetchDesignations = ()=>{
    return new Promise((resolve,reject)=>{
        Designation.find({},(err,designations)=>{
            if (err)reject("Error finding designations "+err);
            else resolve(designations);

        })


    })
};