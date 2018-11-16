const Post = require('../../models/post'),
    Function = require('../../functions'),
    router = require('express').Router();

router.get('/', async (req, res)=>{
    try{
        switch(req.header('accept')){
            case 'application/json' :
                let posts = await Post.fetchPosts();
            break;
    }
    }catch(e){
        console.log(e);
        return res.sendStatus(INTERNAL_SERVER_ERROR);
    }
});
module.exports = router;