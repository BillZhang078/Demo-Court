const User = require('../models/user');
const crypto = require('crypto'); 
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const moment = require('moment');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const express = require('express');
const Video = require('../models/videos');
const session = require('express-session');
const {check} = require('express-validator/check');
const { validationResult } = require('express-validator/check');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}))

const router = express.Router()

//router.get('/', userController.postLogin);

exports.getLoginPage = (req, res)=> {
  let errorMessage = req.flash('error');
  if(errorMessage.length>0){
    errorMessage = errorMessage[0];
  }
  else{
    errorMessage = null;
  }
  res.render('signin',{
      errorMessage:errorMessage
  });
}

exports.singIn = (req, res, next) => {
    console.log(req.body.email);
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
  let errorMessage = req.flash('error');
  if(errorMessage.length>0){
    errorMessage = errorMessage[0];
  }
  else{
    errorMessage = null;
  }
  res.render('register2',{
    status:'A member',
    errorMessage:errorMessage
  })
})

exports.singUp = (req,res,next)=>{
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const type = req.body.type;
    return bcryptjs.hash(password,12)
    .then(hashedPassword=>{
        const user  = new User({
            username:username,
            email:email,
            password:hashedPassword,
            description:'',
            university:'',
            major:'',
            avatar:'images/defaultAvatar.png',
            location:'',
            type:type,
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
    res.redirect('/p');
  });
 
}
exports.getEditPage = (req,res,next)=>{
  
    if(!req.session.isLoggedIn){
      return res.redirect('/login');
    }
    res.render('editProfile',{
        discription: req.user.description,
        education:req.user.university,
        phoneNumber:req.user.phoneNumber,
        location:req.user.location,
        avatar:req.user.avatar,
        createTime:moment(req.user.created_time).format('LL'),
        user:req.user
    });
}
exports.EditAvatar = (req, res, next) => {

    console.log(req.file);
    const prodId = req.user._id;
    const updatedImage = req.file;
    const updatedImageUrl = encodeURI(updatedImage.path);
    User.findById(prodId)
      .then(user => {
        user.avatar = updatedImageUrl;
        return user.save();
      })
      .then(result => {
        console.log('UPDATED Profile!');
        res.redirect('/editProfile');
      })
      .catch(err => console.log(err));
  };
  exports.EditResume = (req, res, next) => {
    console.log(req.file);
    const prodId = req.user._id;
    const updatedPdf = req.file;
    const updatedResume= encodeURI(updatedPdf.path);
    User.findById(prodId)
      .then(user => {
        user.resume = updatedResume;
        return user.save();
      })
      .then(result => {
        console.log('UPDATED Profile!');
        res.redirect('/editProfile');
      })
      .catch(err => console.log(err));
  };
  exports.EditDiscription = (req, res, next) => {
    const prodId = req.user._id;
    const updatedBio = req.body.updatedBio;
    User.findById(prodId)
      .then(user => {
        user.description = updatedBio;
        return user.save();
      })
      .then(result => {
        console.log('UPDATED Profile!');
        res.redirect('/editProfile');
      })
      .catch(err => console.log(err));
  };

  exports.EditPhoneNumber = (req, res, next) => {
    const prodId = req.user._id;
    const updatedPhone = req.body.updatedPhone;
    User.findById(prodId)
      .then(user => {
        user.phoneNumber = updatedPhone;
        return user.save();
      })
      .then(result => {
        console.log('UPDATED Profile!');
        res.redirect('/editProfile');
      })
      .catch(err => console.log(err));
  };
  exports.EditWebsite = (req, res, next) => {
    const prodId = req.user._id;
    const updatedWebsite = req.body.updatedWebsite;
    User.findById(prodId)
      .then(user => {
        user.website = updatedWebsite;
        return user.save();
      })
      .then(result => {
        console.log('UPDATED Profile!');
        res.redirect('/companyProfile');
      })
      .catch(err => console.log(err));
  };

  exports.EditUniversity = (req, res, next) => {
    const prodId = req.user._id;
    const updatedUniversity = req.body.updatedUniversity;
    User.findById(prodId)
      .then(user => {
        user.university = updatedUniversity;
        return user.save();
      })
      .then(result => {
        console.log('UPDATED Profile!');
        res.redirect('/editProfile');
      })
      .catch(err => console.log(err));
  };
  exports.EditUserName = (req, res, next) => {
    const prodId = req.user._id;
    const updatedUserName = req.body.newUserName;
    User.findById(prodId)
      .then(user => {
        user.username = updatedUserName;
        return user.save();
      })
      .then(result => {
        console.log('UPDATED Profile!');
        res.redirect('/editProfile');
      })
      .catch(err => console.log(err));
  };
  exports.EditLocation = (req, res, next) => {
    const prodId = req.user._id;
    const updatedLocation = req.body.updatedLocation;
    User.findById(prodId)
      .then(user => {
        user.location= updatedLocation;
        return user.save();
      })
      .then(result => {
        console.log('UPDATED Profile!');
        res.redirect('/editProfile');
      })
      .catch(err => console.log(err));
  };

  exports.EditEmail = (req, res, next) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    console.log(errors);
    return res.status(422).render('editAccount', {
      user:req.user,
      errorMessage: errors.array()[0].msg,
      email:req.user.email,
     
    createTime:moment(req.user.created_time).format('LL')
    });
  }
   let prodId = req.user._id;
   console.log(req.user._id);
    const updatedEmail= req.body.newEmail;
    const password = req.body.password;
    bcryptjs
          .compare(password, req.user.password)
          .then(doMatch => {
            if (doMatch) {
              console.log(req.user._id);
              User.findById(req.user._id)
              .then(user => {
                user.email= updatedEmail;
                return user.save();
              })
              .then(result => {
                console.log('UPDATED Profile!');
                res.redirect('/editAccount');
              })
              .catch(err => console.log(err));
            }
            
          })
          .catch(err => {
            console.log(err);
          });
          
    User.findById(prodId)
      .then(user => {
        user.email= updatedEmail;
        return user.save();
      })
      .then(result => {
        console.log('UPDATED Profile!');
        res.redirect('/editAccount');
      })
      .catch(err => console.log(err));
  };


exports.getAuthorPgae = (req,res,next)=>{
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  const userId = req.params.userId;
  User.findById(userId)
  .then(user=>{
    user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render("personalPage", {
        username: user.username,
        products: products,
        number: products.length,
        image: user.avatar,
        description: user.description,
        email:user.email,
        isAuthor :false,
        resume:user.resume,
        user1:user,
        user:req.user,
        moment:moment
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  })
  .catch(err=>{
    console.log(err);
  })
  // });
}

exports.getAccountPage = (req,res,next)=>{
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  let message = req.flash('error');
  if(message.length>0){
    message = message[0];
  }
  else{
    message = null;
  }
  return res.render("editaccount.ejs",{
    errorMessage:message,
    email:req.user.email,
    user:req.user,
    createTime:moment(req.user.created_time).format('LL')
  });
}

exports.getResetPage = (req,res,next)=>{
  const token = req.params.token;
  User.findOne({ resetToken: token})
    .then(user => {
      console.log(user);
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('resetPassword.ejs', {
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.postNewPassword = (req, res, next) => {
  let newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const errors = validationResult(req);
  const passwordToken = req.body.passwordToken;
    let resetUser;
  // if (!errors.isEmpty()) {
  //   console.log(errors.array());
  //   return res.status(422).render('resetPassword', {
  //     errorMessage: errors.array()[0].msg
  //   });
  // }
  let message = req.flash('error');
  if(message.length>0){
    message = message[0];
  }
  else{
    message = null;
  } 
    User.findOne({
      resetToken: passwordToken,
      _id: userId
    })
      .then(user => {
        console.log(user);
        resetUser = user;
        return bcryptjs.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(result => {
        console.log("Have Updated Password");
        res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
      });
 
  
  //const passwordToken = req.body.passwordToken;
//   req.user.updateOne({
//   })
//     .then(user => {
//       resetUser = user;
//       return bcryptjs.hash(newPassword, 12);
//     })
//     .then(hashedPassword => {
//       resetUser.password = hashedPassword;
//       return resetUser.save();
//     })
//     .then(result => {
//       res.redirect('/login');
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.getReset = (req, res, next) => {
//   let message = req.flash('error');
//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.render('auth/reset', {
//     path: '/reset',
//     pageTitle: 'Reset Password',
//     errorMessage: message
//   });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        console.log(user)
        user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'DemoCourt@node-complete.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://www.democourt.com/resetPage/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};