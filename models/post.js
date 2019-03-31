const mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    err = require('../lib/err'),
    Function = require('../lib/functions'),
    Schema = mongoose.Schema;
let pstSchema = new Schema({
    'title':{
        type: String,
        required : true
    },
    'author':{
        type:ObjectId,
        ref : 'User',
        required:true
    }
});

const Post = module.exports = mongoose.model('Post',pstSchema);
module.exports.fetchPosts = (query,options)=>{
return new Promise(async (resolve,reject)=>{
    try{
        let fields = options && options['select'],
        populate = options && options['populate']
        i=0;
        query = Post.find(query);
        fields?query.select(fields):'';
        const len = populatev && populate.length;
    while(i<len){
        query.populate(populate[i]);
        i++;
    }
    let posts = await query.exec();
    return resolve(posts);
    }catch(e){
        return reject("Error fetching posts "+e)
    }
});
}