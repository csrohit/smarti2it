const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const teacherSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String//,
        // required: true
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
    return new Promise( async (resolve , reject)=>{
        try {
            let fields = options && options['select'],
                populate = options && options['populate'];
            query = Teacher.find(query);
            fields?query.select(fields):'';
            let len = populate && populate.length,i=0;
            while (i<len){
                    query.populate(populate[i]);
                    i++;
                }
                let users = await query.exec();
            return resolve(users);
        }catch (e) {
            return reject("Error finding teachers "+e);
        }
    })
};
module.exports.fetchTeacherById = (_id,options)=>{
    return new Promise( async (resolve , reject)=>{
        try {
            let query = Teacher.findById(_id),fields = options && options['select'],populate = options && options['populate'];
            fields?query.select(fields):'';
            let len = populate && populate.length,i=0;
            while (i<len){
                    query.populate(populate[i]);
                    i++;
                }
                let result = await query.exec();
            return resolve(result);
        }catch (e) {
            return reject("Error finding teacher "+e);
        }
    })
};
module.exports.update = (_id, set)=>{
    return new Promise( async (resolve,reject)=>{
        try{
            let query = Teacher.updateOne({'_id':_id},{$set:set});
            query = await query.exec()
            console.log(query);
            return resolve(query);
        }catch(e){
            return reject("Error updating teacher "+e);
        };
    });
};
module.exports.delete = _id =>{
    return new Promise( async (resolve, reject)=>{
        try{
            let query = Teacher.findByIdAndDelete({'_id':_id});
            return resolve(query.exec());
        }catch(e){
            return reject("Error deleting teacher "+e);
        }
    });
};