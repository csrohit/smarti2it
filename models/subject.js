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
    /*
    * return s a single subject, query must be a standard query eg. {"_id":"5babd111ce1b43095b413d04"}
    * */

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
module.exports.update = async newSubject=>{
  /*
  * requires a valid subject object
  * */
  return new Promise((resolve,reject)=>{
     try {
         let subject = Subject.fetchSubject({'_id':newSubject._id});
         let data = {
           name:newSubject.name,
           head_teacher:newSubject.head_teacher,
           department: newSubject.department,
           class: newSubject.class
         };
         console.log(newSubject);
         console.log(newSubject._id);
         Subject.updateOne({'_id':newSubject._id},data,(err,subject)=>{
             if (err) return reject("Error updating subject "+err);
             else return resolve(subject);
         });
     } catch (e) {
         return reject("Error finding subject for update "+e);
     }
  });


};
