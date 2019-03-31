const mongoose = require('mongoose');

const  Schema = mongoose.Schema;
const commentSchema = new Schema({
    body:{
        type:String,
        required:true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:'Post'
    },
    time:{
        type:Date,
        default:Date.now(),
        required: true
    }
});

const Comment = module.exports = mongoose.model('Comment',commentSchema);

module.exports.createComment = newComment=>{
  return new Promise((resolve,reject)=>{
      newComment.save((err,newComment)=>{
          if (err)reject("Error creating comment "+err);
          else resolve(newComment);
      });
  });
};