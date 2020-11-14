const express = require('express');
const router = express.Router();
const bcrypt= require('bcryptjs');
const saltRounds= 10;
const User = require ('../models/User.model');

router.get('/signup', (req, res, next) => 
    res.render('user/auth'));

router.post('/signup', (req,res)=>{
    const {username, email, password}= req.body;
    const salt= bcrypt.genSaltSync(saltRounds);
    const hashpassword=bcrypt.hashSync(password,salt);
    if (username === ''|| password==='') {
      res.render('user/auth', {
      errorMessage: 'Indicate username and password'
    });
  };
  User.findOne({'username': username})
    .then((user)=>{
      if(user) {
        res.render('user/auth', {
          errorMessage: 'The username already exists'
        })
      }
      return;
  });
    User.create({username, email, password : hashpassword})
      .then(()=>{
        res.redirect(('/main'))
  }). catch ((error)=>{
    if (error.code === 11000){
      res.render('user/auth', {
        errorMessage: 'Username and email bla'
      })
    }})
  });
  router.get ('/login', (req, res, next)=>{
    res.render('user/login');
})

router.post('/login', (req, res) => {
  console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;
  if (!username || !password) {
    res.render('user/login', {
      errorMessage: 'Please enter both username and password'
    });
    return;
  }
  User.findOne({'username': username})
    .then((user) => {
      if(!user) {
        res.render('user/login', {
          errorMessage: 'Invalid login'
        })
        //User doesn't exist on the database
        return;
        
      }
      else if (bcrypt.compareSync(password, user.password)) {
        res.render('user/main', {users: user.username} );
        console.log(users);
        res.redirect('/main');
      } else {
        //Passwords don't match
        res.render('user/login', {
          errorMessage: 'Password doesnt match with user'
        });
      }
    }).catch('error');
});
  router.get('/main', (req, res, next) => 
  res.render('user/main'));

  router.get('/main/private', (req, res, next) => 
  res.render('user/private'));



  module.exports=router;