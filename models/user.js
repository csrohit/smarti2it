const mongoose = require('mongoose'),
    Function = require('../lib/functions'),
    ObjectId = require('mongoose').Types.ObjectId,
    Err = require('../lib/err'),
    bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    rank:{
        type:String,
        required:true
    },
    designation:{
        type:Schema.Types.ObjectId,
        ref:'Designation',
        required:true
    },
    name:{
      type:String,
      required:true
    },
    profile:{
        type:Schema.Types.ObjectId,
        required:true
    }    
});

const User = module.exports = mongoose.model('User',userSchema);


module.exports.createUser = (newUser)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.genSalt(10,(err,salt)=>{
            if (err) reject("Error generating salt \n"+err);
            else {
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if (err)reject("Error hashing password\n"+err);
                    else {
                        newUser.password = hash;
                        newUser.save((err,newUser)=>{
                            if (err)reject("Error ceatig user "+err);
                            else resolve(newUser);
                        });
                    }
                })
            }
        })
    })
}
// module.exports.fetchByUsername = username=>{
// return new Promise((resolve,reject)=>{
//     User.findOne({username: username}).populate('designation').exec((err,user)=>{
//         if (err)reject("Error finding user "+err);
//         else resolve(user);
//     })
// })
//};

module.exports.fetchUserById = (_id,options)=>{
    return new Promise( async (resolve , reject)=>{
        try {
            let query = User.findById(_id),
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
            return reject("Error finding users "+e);
        }
    })
};


module.exports.comparePassword = (candidatePassword, hash)=>{
return new Promise((resolve,reject)=>{
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) return reject("error comparing password "+err);
        return resolve(isMatch);
    });
})
};
module.exports.fetchByUsername= (username,params) =>{
    return new Promise(async (resolve,reject)=>{
        let query = User.findOne({username:username});
        let i=0,len = params && params.length;
        while (i < len){
            query.populate(params[i]);
            i++;
        }
        query.exec((err,user)=>{
            if (!err){
                return resolve(user);
            }
            return reject("Error finding user "+err);
        })
    })
};
module.exports.fetchUsers = (query,options)=>{
    return new Promise( async (resolve , reject)=>{
        try {
            let fields = options && options['select'],
                populate = options && options['populate'];
            query = User.find(query);
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
module.exports.delete = _id =>{
    return new Promise( async (resolve,reject)=>{
       try{
        let query = User.findOneAndDelete({'_id':_id});
        let result = await query.exec();
        return resolve(result);
       }catch(e){
           return reject("Error deleting user"+ e);
       }
    });
}
module.exports.encryptPassword = password =>{
    return new Promise((resolve, reject)=>{
        bcrypt.genSalt(10,(err,salt)=>{
            if (err) reject("Error generating salt \n"+err);
            else {
                bcrypt.hash(password,salt,(err,hash)=>{
                    if (err)reject("Error hashing password\n"+err);
                    else {
                        return resolve(hash);
                    }
                });
            }
        });
    });
}
module.exports.update = (_id, set)=>{
    return new Promise( async (resolve, reject)=>{
        try{
            let query = User.updateOne({'_id':_id},{$set:set});
            return resolve(await query.exec());
        }catch(e){
            return reject("Error updating user "+e);
        }
    });
}
function _throw(e) {
    return Function.pushError(e);
}