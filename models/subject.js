const mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Teacher = require('./teacher'),
    Department = require('./department'),
    Class = require('./class');

const Schema = mongoose.Schema;
const subjectSchema = new Schema({
   name:{
       type:String,
       required:true
   },
   teacher:{
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
    },
    course_objectives:{
        type:String
    },
    course_outcomes:{
        type:String
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
module.exports.fetchSubjects = (query,options)=>{
    /*
    * query should be a standard mongoose query
    * */
    return new Promise( async (resolve , reject)=>{
        query = Subject.find(query);
        let len = options && options.length,i=0;
        while (i<len){
            query.populate(options[i]);
            i++;
        }
        try {
            let subjects = await query.exec();
            resolve(subjects);
        }catch (e) {
            reject("Error finding subjects "+e);
        }
    })
};
module.exports.fetchSubjectById = (_id,options)=>{
    return new Promise( async (resolve , reject)=>{
        try {
            let len = options && options.length,i=0,
            query = Subject.findOne({'_id':_id});
            while (i<len){
                query.populate(options[i]);
                i++;
            }
            let subjects = await query.exec();
            resolve(subjects);
        }catch (e) {
            reject("Error finding subjects "+e);
        }
    })
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
module.exports.update = async (_id, set)=>{
  return new Promise( async (resolve, reject)=>{
     try {
         let query = Subject.updateOne({'_id':_id},{$set:set});
         return resolve(await query.exec());
     } catch (e) {
         return reject("Error finding subject for update "+e);
     }
  });
};
