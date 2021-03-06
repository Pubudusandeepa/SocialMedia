const express = require('express');
const request = require('request');
const config = require('config');
const router =  express.Router();
const { check , validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
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

//@route post api/profile/me
//@desc Test route
//@access Private

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
    var str = skills.toString()
     profileFields.str = str.split(',').map(skill => skill.trim());
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
     console.error("error pd"+err.message);
     res.status(500).send('Server Error');

   }

   console.log(profileFields.skills);
  //  res.send('Hello');

});

//@route Get api/profile/
//@desc Test route
//@access Public

router.get('/', async(req, res) =>{
  try {
     const profiles = await Profile.find({
       user: req.params.user_id
     }).populate('user', ['name', 'avatar']);

     if(!profiles) return res.status(400).json({ msg: 'profile is not found'});
     res.json(profiles);
  } catch (error) {
    console.error(error.message);
    if(error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found'});
    }
    res.status(500).send('Server Error');

  }

});

//@route Get api/profile/
//@desc Test route
//@access Public

router.get('/user/:user_id', async(req, res) =>{
    try {
       const profile = await Profile.findOne({
         user: req.params.user_id
       }).populate('user', ['name', 'avatar']);

       if(!profile) return res.status(400).json({ msg: 'profile is not found'});
       res.json(profile);
    } catch (error) {
      console.error(error.message);
      if(error.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Profile not found'});
      }
      res.status(500).send('Server Error');

    }

});

//@route Dlete api/profile/
//@desc Delete profile and user post
//@access private



router.delete('/', auth, async(req, res) =>{
  try {
    //@todo -remove users posts

    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove User
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted'});
  } catch (error) {
    console.error(error.message);
    if(error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found'});
    }
    res.status(500).send('Server Error');

  }

});
 
//@route ADD api/profile/
//@desc Add profile experince
//@access private

router.put('/experience', 
[
  auth,
   [
     check('title', 'Title is required').not().isEmpty(),
     check('company', 'Company is required').not().isEmpty(),
     check('from', 'From date is required').not().isEmpty()


]],
   async (req, res) => {
     const errors = validationResult(req);
     if(!errors.isEmpty()){
       return res.status(400).json({ errors: errors.array()});
     }


     const {
       title,
       company,
       location,
       from,
       to,
       current,
       description
     } = req.body;

     const newExp = {
       title: title,
       company: company,
       location: location,
       from: from,
       to: to,
       current: current,
       description: description
     };

     try {
       const profile = await Profile.findOne({ user: req.user.id });
       profile.experience.unshift(newExp);
       await profile.save();

       res.json(profile);
       
     } catch (error) {
       console.error(error.message);
       res.status(500).send('Server Error');
     }

   }
);

//@route Delete api/profile/experience/:exp_id
//@desc delete experience from profile
//@access Private

router.delete('/experience/:exp_id', auth, async (req, res) =>{
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.experience.map(item  => item.id).indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
    
  }
});

 
//@route ADD api/profile/
//@desc Add profile experince
//@access private

router.put('/education', 
[
  auth,
   [
     check('school', 'School is required').not().isEmpty(),
     check('degree', 'Degree is required').not().isEmpty(),
     check('fieldofstudy', 'Field of  is required').not().isEmpty(),
     check('from', 'From  date  is required').not().isEmpty()


]],
   async (req, res) => {
     const errors = validationResult(req);
     if(!errors.isEmpty()){
       return res.status(400).json({ errors: errors.array()});
     }


     const {
       school,
       degree,
       fieldofstudy,
       from,
       to,
       current,
       description
     } = req.body;

     const newEdu = {
      school,
      degree,
      fieldofstudy,
       from,
        to,
       current,
     description
     };

     try {
       const profile = await Profile.findOne({ user: req.user.id });
       profile.education.unshift(newEdu);
       await profile.save();

       res.json(profile);
       
     } catch (error) {
       console.error(error.message);
       res.status(500).send('Server Error');
     }

   }
);

//@route Delete api/education/:edu_id
//@desc   delete profile experince
//@access private

router.delete('/education/:edu_id', auth, async (req, res) =>{
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.education.map(item  => item.id).indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
    
  }
});

//route GET api/profile/github/:username
//desc Get user repos from Github
//access Public
router.get('/github/:username', (req,res) =>{
    try {
        const options = {
          uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
          sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=
          ${config.get('githubSecret')}`,
          method: 'GET',
          headers: {'user-agent': 'node.js'}
        };

        request(options, (error, response, body) => {
          if(error) console.error(error);

          if(response.statusCode !== 200 ) {
            res.status(404).json({msg : 'No git hub profile found'});
          }
          res.json(JSON.parse(body));
        });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
});



module.exports = router;