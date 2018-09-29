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
module.exports.fetchSubjects = (query,options)=>{
    /*
    * query should be a standard mongoose query
    * */
    return new Promise( async (resolve , reject)=>{
        query = Class.find(query);
        let len = options && options.length,i=0;
        while (i<len){
            query.populate(options[i]);
            i++;
        }
        try {
            let result = await query.exec();
            resolve(result);
        }catch (e) {
            reject("Error finding classes "+e);
        }
    })
};