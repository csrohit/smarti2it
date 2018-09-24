const mongoose = require('mongoose'),
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
    designation:{
        type:Schema.Types.ObjectId,
        ref:'Designation'
    },
    name:{
      type:String,
      required:true
    },
    profile:{
        kind:{
            type:String,
            required:true
        },
        profile:{
            type:Schema.Types.ObjectId,
            refPath:'profile.kind',
            required:true
        }
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
module.exports.fetchByUsername = username=>{
return new Promise((resolve,reject)=>{
    User.findOne({username: username}).populate('designation').exec((err,user)=>{
        if (err)reject("Error finding user "+err);
        else resolve(user);
    })
})
};
module.exports.fetchUserById = id=>{
    return new Promise((resolve,reject)=>{
        User.findById(id).exec((err,user)=>{
            if (err)reject("Error finding user "+err);
            else resolve(user);
        })
    })
};
module.exports.comparePassword = (candidatePassword, hash)=>{
return new Promise((resolve,reject)=>{
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) reject("error comparing password "+err);
        resolve(isMatch);
    });
})
};
module.exports.get= (username,params) =>{
    return new Promise(async (resolve,reject)=>{
        let query = User.findOne({username:username});
        let i=0,len = params && params.length;
        while (i < len){
            query.populate(params[i]);
            i++;
        }
        query.exec((err,user)=>{
            if (!err){
                resolve(user);
            }
            reject("Error finding user "+err);
        })
    })
};