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
    return new Promise( async (resolve , reject)=>{
        try {
            let fields = options && options['select'],
                populate = options && options['populate'];
            query = Department.find(query);
            fields?query.select(fields):'';
            let len = populate && populate.length,i=0;
            while (i<len){
                    query.populate(populate[i]);
                    i++;
                }
                let users = await query.exec();
            return resolve(users);
        }catch (e) {
            return reject("Error finding users "+e);
        }
    })
};
module.exports.fetchDepartmentById = (_id,options)=>{
    return new Promise( async (resolve , reject)=>{
        try {
            let query = Department.findById(_id),
            fields = options && options['select'],
            populate = options && options['populate'];
            fields?query.select(fields):'';
            let len = populate && populate.length,i=0;
            while (i<len){
                    query.populate(populate[i]);
                    i++;
                }
                let users = await query.exec();
            return resolve(users);
        }catch (e) {
            return reject("Error finding department "+e);
        }
    })
};
module.exports.update = (_id, set)=>{
    return new Promise( async (resolve,reject)=>{
        try{
            let query = Department.updateOne({'_id':_id},{$set:set});
            query = await query.exec();
            return resolve(query);
        }catch(e){
            return reject("Error updating department "+e);
        };
    });
};
module.exports.delete = _id =>{
    return new Promise( async (resolve, reject)=>{
        try{
            let query = Department.findByIdAndDelete(_id);
            query = await query.exec();
            return resolve(query);
        }catch(e){
            return reject("Error deleting department "+e);
        }
    });
};