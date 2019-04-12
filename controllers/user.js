const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const express = require('express')
const session = require('express-session')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}))

const router = express.Router()

//router.get('/', userController.postLogin);

exports.getLoginPage = (req, res)=> {
  res.render('login',{
      errorMessage:req.flash('error')
  });
}

exports.singIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash('error','Invalid email or password'); 
          return res.redirect('/login');
        }
        bcryptjs
          .compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              //req.session.avatar = user.avatar;
              return req.session.save(err => {
                res.redirect('/');
              });
            }
            req.flash('error','Invalid email or password');
            res.redirect('/login');
          })
          .catch(err => {
            console.log(err);
            res.redirect('/login');
          });
      })
      .catch(err => console.log(err));
  };

exports.getRegiserPage = (function (req, res) {
  res.render('register2',{status:'A member'})
})

exports.singUp = (req,res,next)=>{
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    return bcryptjs.hash(password,12)
    .then(hashedPassword=>{
        const user  = new User({
            username:username,
            email:email,
            password:hashedPassword,
            description:'',
            university:'',
            major:'',
            videoCollection:{ videos:[{quantity:0}] }
        });
        return user.save();
   
    }) 
   
    .then(result=>{
        console.log('A new member join in ');
        res.redirect('/login');
        return transporter.sendMail({
            to:email,
            from:'1007276924@qq.com',
            subject:'Signup succeeded',
            html:'<h1>You successfully sign up!</h1>'
        }).catch(err=>{
            console.log(err);
        })   
        //res.redirect('/login');
    })
    .catch(err=>{

        console.log(err);
    })
}

exports.signOut = (req, res,next)=>{
  req.session.destroy((err)=>{
    console.log(err);
    res.redirect('/');
  });
 
}
exports.getEditPage = (req,res,next)=>{
    res.render('editProfile');
}
exports.postEditProfile = (req, res, next) => {
    const prodId = req.user._id;
    const updatedBio = req.body.Bio;
    const updatedUniversity = req.body.university;
    //const updatedImage = req.file;
    //console.log(updatedImage);
    //const updatedImageUrl = updatedImage.path;
    User.findById(prodId)
      .then(user => {
        user.description = updatedBio;
        user.university = updatedUniversity;
        user.major = '';
        //user.avatar = updatedImageUrl;
        return user.save();
      })
      .then(result => {
        console.log('UPDATED Profile!');
        res.redirect('personal');
      })
      .catch(err => console.log(err));
  };




