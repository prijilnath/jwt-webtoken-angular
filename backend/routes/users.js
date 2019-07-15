var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');

/* User registration. */
router.post('/register', function(req, res, next) {
  console.log(req.body);
    var user = new User({
      email: req.body.email,
      name:req.body.name,
      password:User.hashPassword(req.body.password),
      date:Date.now()
    })
    let promise = user.save();
    promise.then((doc)=>{
      res.status(200).json(doc);
    });
    promise.catch((err)=>{
      res.status(501).json({message:'Error registering user!'})
    })
});

/* User login */
router.post('/login', function(req,res){
  console.log(req.body);
  let promise = User.findOne({email:req.body.email}).exec();
  promise.then(function(doc){
    if(doc){
      if(doc.isValid(req.body.password)){
        //generate token
        let token = jwt.sign({username:doc.email}, 'secret', {expiresIn:'1h'});
        return res.status(200).json(token);
      }else {
        return res.status(501).json({message:'Invalid credentails!'});
      }
    }else {
      return res.status(501).json({message:'User email is not registered!'})
    }
  }).catch(function(err){
    return res.status(501).json(err);
  });
})
/* get User name */
router.get('/username', verifyToken,function(req,res,next){
  return res.status(200).json(decodToken.username)
})
let decodToken = '';
function verifyToken(req, res, next) {
  let token = req.query.token;
  console.log(token);
  jwt.verify(token, 'secret', function(err, tokendata){
    if(err) {
      return res.status(401).json({message:'Unauthorized login!'})
    }
    if(tokendata) {
      decodToken = tokendata;
      next();
    }
  })
}
module.exports = router;
