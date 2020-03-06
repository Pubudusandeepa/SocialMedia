const express = require('express');
const router =  express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Prifile');
const User = require('../../models/User');

//@route Post api/posts
//@desc Create a post
//@access private

router.post('/', 
[auth,
     [
   check('text', 'Text is required').not().isEmpty()
]], 
async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    const user = await User.findById(req.user.id).select('-password');
    
    try {
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }  
});

//@route Get api/posts
//dest  Get all posts
//access private

router.get('/', auth, async (req, res) =>{
    try {
        const posts = await Post.find().sort({ date: -1});
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
        
    }
})
module.exports = router;