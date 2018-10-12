const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const departmentSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    faculty:[{
        type: Schema.Types.ObjectId,
        ref:'Teacher'
    }],
    subjects:[{
        type:Schema.Types.ObjectId,
        ref:'Subject'
    }],
    classes:[{
        type:Schema.Types.ObjectId,
        ref:'Class'
    }],
    head:{
        type:Schema.Types.ObjectId,
        ref:'Teacher'
    },
    labs:[{
        type:Schema.Types.ObjectId,
        ref:'Lab'
    }],
    offices:[{
        type:Schema.Types.ObjectId,
        ref:'Office'
    }]
});

const Department = module.exports = mongoose.model('Department',departmentSchema);

module.exports.createDepartment = newDepartment=>{
  return new Promise((resolve,reject)=>{
      newDepartment.save((err,newDepartment)=>{
          if (err) return reject("Error creating department "+err);
          else return resolve(newDepartment);
      })
  })
};
module.exports.fetchDepartments = (query,options)=>{
    /*
    * query should be a standard mongoose query
    * */
    return new Promise( async (resolve , reject)=>{
        query = Department.find(query);
        let len = options && options.length,i=0;
        while (i<len){
            query.populate(options[i]);
            i++;
        }
        try {
            let result = await query.exec();
            return resolve(result);
        }catch (e) {
            return reject("Error finding departments "+e);
        }
    })
};