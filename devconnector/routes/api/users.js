const express = require('express');
const router =  express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

//@route Post api/users
//@desc Test route
//@access Public

router.post('/',
[
  check('name', 'Name is Required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'please enter the password with 6 or more characters').isLength({ min: 6})
], 
async (req, res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json({errors: errors.array()});
   }
  

    const {name, email, password } = req.body;

    try{
        //see if user exists
        let user = await User.findOne({ email });

        if(user){
          return  res.status(400).json({ errors: [{msg: 'User alrady exists'}]});
        }

        //Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        }); 

        //Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        //return web token
        res.send('User register');

    }catch(err){
      console.error(err.message);
      res.status(500).send('Server error');
    }


});
module.exports = router;