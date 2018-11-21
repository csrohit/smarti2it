const mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    err = require('../err'),
    Function = require('../functions'),
    Schema = mongoose.Schema;

const studentSchema = new Schema({
   name:{
       type:String,
       required:true
   },
   email:{
       type: String,
       required: true
   },
    roll_no:{
       type:Number,
        required:true
    },
    department:{
       type:Schema.Types.ObjectId,
        ref:'Department'
    },
    classs:{
       type:Schema.Types.ObjectId,
        ref:'Classs'
    }
});

const Student = module.exports = mongoose.model('Student',studentSchema);
module.exports.createStudent = newStudent=>{
    return new Promise((resolve,reject)=>{
        newStudent.save((err,newStudent)=>{
            if (!err)return resolve(newStudent);
            else return reject("Error creating student "+err);
        })
    })
}
module.exports.fetchStudents = ()=>{
  return new Promise((resolve,reject)=>{
      Student.find({},(err,students)=>{
          if (!err)resolve(students);
          else reject("Error finding students");
      })
  })
}
module.exports.fetchStudentById = (_id,options)=>{
    return new Promise( async (resolve , reject)=>{
        try {
            let query = Student.findById(_id),fields = options && options['select'],populate = options && options['populate'];
            fields?query.select(fields):'';
            let len = populate && populate.length,i=0;
            while (i<len){
                    query.populate(populate[i]);
                    i++;
                }
                let result = await query.exec();
            return resolve(result);
        }catch (e) {
            return reject("Error finding student "+e);
        }
    })
};
module.exports.update = (_id, set)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            {ObjectId.isValid(_id)?'':_throw(err.INVALID_ID);}
            let query = await Student.updateOne({'_id':_id},{$set:set});
            query = JSON.parse(JSON.stringify(query));
            // {query.ok?'':_throw(err.STUDENT_UNCHANGED);}
            return resolve(query);
        }catch(e){
            e.msg?'':e=Function.pushError(err.STUDENT_DOES_NOT_EXIST);
            return reject(e);
        }
    });
}
module.exports.delete = _id =>{
    return new Promise( async (resolve, reject)=>{
        try{
            {ObjectId.isValid(_id)?'':_throw(err.INVALID_ID);}
            let query = Student.findByIdAndDelete({'_id':_id});
            query = await query.exec();
            {query?'':_throw(err.STUDENT_DOES_NOT_EXIST);}
            return resolve(query);
        }catch(e){
            e.msg?'':e=Function.pushError(err.STUDENT_DOES_NOT_EXIST);
            return reject(e);
        }
    });
};

function _throw(e){
    throw Function.pushError(e);
}