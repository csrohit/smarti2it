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
            if (err)reject("Error creating teacher "+err);
            else resolve(newTeacher);
        })
    })
};
module.exports.fetchTeachers = (query,options)=>{
    /* 
    *   query sould be a standard mongoose query
    *  */
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

module.exports.fetchTeacher = (query,options)=>{
    /*
    * return s a single subject, query must be a standard query eg. {"_id":"5babd111ce1b43095b413d04"}
    * */
    return new Promise( async (resolve , reject)=>{
        query = Teacher.findOne(query);
        let len = options && options.length,i=0;
        while (i<len){
            query.populate(options[i]);
            i++;
        }
        try {
            let teacher = await query.exec();
            return resolve(teacher);
        }catch (e) {
            return reject("Error finding teacher "+e);
        }
    })
};

module.exports.update = ()=>{
    return new Promise( async (resolve,reject)=>{
        try{
            let teacher = await Teacher.fetchTeacher({'_id':newTeacher._id});
            let data = {
                
            };
        }catch(e){
            return reject("Error updating teacher "+e);
        };
    });
};