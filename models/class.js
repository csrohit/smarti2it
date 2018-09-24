const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const classSchema = new Schema({
    name:{
       type:String,
       required:true
    },
    department:{
       type: Schema.Types.ObjectId,
       ref:'Department'
    },
    head_teacher: {
       type:Schema.Types.ObjectId,
        ref:'Teacher'
    },
    students:[{
       type:Schema.Types.ObjectId,
        ref:'Student'
    }],
    strength:{
       type:Number
    },
    room:{
        type:String
    }
});

const Class = module.exports = mongoose.model('Class',classSchema);

module.exports.createClass = newClass=>{
  return new Promise((resolve,reject)=>{
     newClass.save((err,newClass)=>{
         if (err)reject("Error creating class "+err);
         else resolve(newClass);
     })
  });
};