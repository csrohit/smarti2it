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
    return new Promise( async (resolve , reject)=>{
        try {
            let fields = options && options['select'],
                populate = options && options['populate'];
            query = Subject.find(query);
            fields?query.select(fields):'';
            let len = populate && populate.length,i=0;
            while (i<len){
                    query.populate(populate[i]);
                    i++;
                }
                let users = await query.exec();
            return resolve(users);
        }catch (e) {
            return reject("Error finding subjects "+e);
        }
    })
};

module.exports.fetchSubjectById = (_id,options)=>{
    return new Promise( async (resolve , reject)=>{
        try {
            let query = Subject.findById(_id),
                fields = options && options['select'],
                populate = options && options['populate'];
            fields?query.select(fields):'';
            let len = populate && populate.length,i=0;
            while (i<len){
                    query.populate(populate[i]);
                    i++;
                }
                let result = await query.exec();
            return resolve(result);
        }catch (e) {
            return reject("Error finding subject "+e);
        }
    })
};
module.exports.delete = _id =>{
    return new Promise( async (resolve, reject)=>{
        try{
            let query = Subject.findByIdAndDelete({'_id':_id});
            return resolve(query.exec());
        }catch(e){
            return reject("Error deleting teacher "+e);
        }
    });
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
