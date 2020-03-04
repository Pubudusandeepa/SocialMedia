const express = require('express');
const router =  express.Router();
const { check , validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Profile = require('../../models/Prifile');
const User = require('../../models/User');

//@route Get api/profile/me
//@desc Test route
//@access Public

router.get('/me', auth, async  (req, res) =>{

     try{
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
        ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
     }catch(err){
       console.error(err.message);
       res.status(500).send('Server Error');
     }

    res.send('Posts route')
} );

//@route Get api/profile/me
//@desc Test route
//@access Public

router.post('/', 
[auth,
   [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]],

 async (req, res)=>{
   const errors = validationResult(req);
   if(!errors.isEmpty()){
     return res.status(400).json({ errors: errors.array()});
   }
  
   const {
     company,
     website,
     location,
     bio,
     status,
     githubsername,
     skills,
     youtube,
     facebook,
     twitter,
     instagram,
     linkedin

   } = req.body;

   //build profile object

   const profileFields = {};
   profileFields.user = req.user.id;
   if(company) profileFields.company = company;
   if(website) profileFields.website = website;
   if(location) profileFields.location = location;
   if(bio) profileFields.bio = bio;
   if(status) profileFields.status = status;
   if(githubsername) profileFields.githubsername =githubsername;
   if(skills) {
     profileFields.skills = skills.split(',').map(skill => skill.trim());
   }
   //Build social object
   profileFields.social = {};
   if(youtube) profileFields.social.youtube = youtube;
   if(twitter) profileFields.social.twitter = twitter;
   if(facebook) profileFields.social.facebook = facebook;
   if(linkedin) profileFields.social.linkedin = linkedin;
   if(instagram) profileFields.social.instagram = instagram;

   try{
       let profile = await Profile.findOne({ user: req.user.id});

       if(profile){
         //Update
         profile = await Profile.findOneAndUpdate(
           { user: req.user.id },
           { $set: profileFields},
           { new: true}
         );

         return res.json(profile);
       }

       //create
       profile = new Profile(profileFields);
       await profile.save();

       res.json(profile);
    
   }catch(err){
     console.error(err.message);
     res.status(500).send('Server Error');

   }

   console.log(profileFields.skills);
  //  res.send('Hello');

})

module.exports = router;