const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const designationSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    permissions:[{
        type: String,
        required: true
    }]
});

const Designation = module.exports = mongoose.model('Designation',designationSchema);

// methods
module.exports.createDesignation = newDesignation=>{
  return new Promise((resolve,reject)=>{
      newDesignation.save((err,newDesignation)=>{
          if (err)reject("Error creating designation "+err);
          else resolve(newDesignation);
      })
  })
};
module.exports.fetchDesignations = (query,options)=>{
    return new Promise( async (resolve , reject)=>{
        try {
            let fields = options && options['select'],
                populate = options && options['populate'];
            query = Designation.find(query);
            fields?query.select(fields):'';
            let len = populate && populate.length,i=0;
            while (i<len){
                    query.populate(populate[i]);
                    i++;
                }
                let users = await query.exec();
            return resolve(users);
        }catch (e) {
            return reject("Error finding designations "+e);
        }
    })
};
module.exports.fetchDesignationById = (_id,options)=>{
    return new Promise( async (resolve , reject)=>{
        try {
            let fields = options && options['select'],
                populate = options && options['populate'];
            let query = Designation.findOne(_id);
            fields?query.select(fields):'';
            let len = populate && populate.length,i=0;
            while (i<len){
                    query.populate(populate[i]);
                    i++;
                }
                let users = await query.exec();
            return resolve(users);
        }catch (e) {
            return reject("Error finding designations "+e);
        }
    })
};