const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const teacherSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true
    },
    department:{
        type:Schema.Types.ObjectId,
        ref:'Department'
    },
    subject:{
        type:Schema.Types.ObjectId,
        ref:'Subject'
    },
    class:{
        type:Schema.Types.ObjectId,
        ref:'Class'
    }
});

const Teacher = module.exports = mongoose.model('Teacher',teacherSchema);

module.exports.createTeacher = newTeacher=>{
    return new Promise((resolve,reject)=>{
        newTeacher.save((err,newTeacher)=>{
            if (err)reject("Error creating department "+err);
            else resolve(newTeacher);
        })
    })
};
module.exports.fetchTeachers = (query,options)=>{
    return new Promise( async (resolve , reject)=>{
        query = Teacher.find(query);
        let len = options && options.length,i=0;
        while (i<len){
            query.populate(options[i]);
            i++;
        }
        try {
            let teacher = await query.exec();
            resolve(teacher);
        }catch (e) {
            reject("Error finding teacher "+e);
        }
    })
};
module.exports.get = async (teacher,params) =>{
  return new Promise((resolve,reject)=>{
     let query = Teacher.find({});
     let i=0,len = params.length;
     while (i < len){
         query.populate(params[i]);
         i++;
      }
     query.exec((err,teacher)=>{
         if (!err){
             resolve(teacher);
         }
         reject("Error finding teacher " + err);
     })
  })
};
module.exports.fetchTeacher = (query,options)=>{
    return new Promise( async (resolve , reject)=>{
        query = Teacher.findOne(query);
        let len = options && options.length,i=0;
        while (i<len){
            query.populate(options[i]);
            i++;
        }
        try {
            let teacher = await query.exec();
            resolve(teacher);
        }catch (e) {
            reject("Error finding teacher "+e);
        }
    })
};