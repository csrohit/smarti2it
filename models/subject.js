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
module.exports.delete = id=>{
  return new Promise((resolve,reject)=>{
      Subject.deleteOne({'_id':id},(err)=>{
          if (!err){
              // delete all the references of subjects
                /*
                * 1. Teacher
                * 2. Class
                * 3. Department
                */
               Subject.fetchSubject()
              return resolve(true);
          }
          return reject("Error deleting Subject " + err)
      })
  })
};
module.exports.fetchSubject = (query,options)=>{
    return new Promise( async (resolve , reject)=>{
        query = Subject.findOne(query);
        let len = options && options.length,i=0;
        while (i<len){
            query.populate(options[i]);
            i++;
        }
        try {
            let subject = await query.exec();
            resolve(subject);
        }catch (e) {
            reject("Error finding teacher "+e);
        }
    })
};
