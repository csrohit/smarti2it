const mongoose = require('mongoose'),
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
    class:{
       type:Schema.Types.ObjectId,
        ref:'Class'
    }
});

const Student = module.exports = mongoose.model('Student',studentSchema);
module.exports.createStudent = newStudent=>{
    return new Promise((resolve,reject)=>{
        newStudent.save((err,newStudent)=>{
            if (!err)resolve(newStudent);
            else reject("Error creating student "+err);
        })
    })
};
module.exports.fetchStudents = ()=>{
  return new Promise((resolve,reject)=>{
      Student.find({},(err,students)=>{
          if (!err)resolve(students);
          else reject("Error finding students");
      })
  })
};
module.exports.fetchStudent = (query,options)=>{
  return new Promise( async (resolve , reject)=>{
       query = Student.findOne(query);
       let len = options && options.length,i=0;
       while (i<len){
           query.populate(options[i]);
           i++;
       }
      try {
          let student = await query.exec();
          resolve(student);
      }catch (e) {
          reject("Error finding student "+e);
      }
  })
};