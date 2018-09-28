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
module.exports.update = async newStudent=>{
    /*
    * requires a valid subject object
    * */
    return new Promise((resolve,reject)=>{
        try {
            let subject = Subject.fetchSubject({'_id':newStudent._id});
            let data = {
                name:newStudent.name,
                roll_no:newStudent.roll_no,
                email:newStudent.email,
                department: newStudent.department,
                class: newStudent.class
            };
            console.log(newStudent);
            console.log(newStudent._id);
            Subject.updateOne({'_id':newStudent._id},data,(err,subject)=>{
                if (err) return reject("Error updating student "+err);
                else return resolve(subject);
            });
        } catch (e) {
            return reject("Error finding student for update "+e);
        }
    });


};