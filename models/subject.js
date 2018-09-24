const mongoose = require('mongoose'),
    Teacher = require('./teacher'),
    Department = require('./department'),
    Class = require('./class');

const Schema = mongoose.Schema;
const subjectSchema = new Schema({
   name:{
       type:String,
       required:true
   },
   head_teacher:{
       type: Schema.Types.ObjectId,
       ref:'Teacher'
   },
    department:{
       type:Schema.Types.ObjectId,
        ref:'Department'
    },
    class:{
       type:Schema.Types.ObjectId,
        ref:'Class'
    },
    university_code:{
       type:Number
        // required: true
    }
});

const Subject = module.exports = mongoose.model('Subject',subjectSchema);
module.exports.createSubject = (newSubject)=>{
  return new Promise((resolve,reject)=>{
        newSubject.save((err)=>{
            if (err)reject("Error creating subject "+err);
            else resolve(newSubject);
        });
  });
};
module.exports.fetchSubjects = ()=>{
  return new Promise((resolve,reject)=>{
     Subject.find({},(err,subjects)=>{
         if (err)reject("Error fetching subjects "+err);
         else resolve(subjects);
     })
  });
};
