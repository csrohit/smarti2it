const Post = require('../../models/post'),
    Function = require('../../lib/functions'),
    router = require('express').Router();

router.get('/',async (req,res)=>{
    if(req.header('accept') === 'application/json'){
        // send all the post in jsonarray
        let posts = await Post.fetchPosts();
        return res.json(posts);
    }
    else{
        // render page with card list of all the posts
    }
});
router.post('/', async (req,res)=>{
    // create a post
});
module.exports = router;