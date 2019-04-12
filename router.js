const express = require('express')
const userController = require('./controllers/user');
const User = require('/Users/meishaonv/Desktop/MCI/DemoCourt/v1/user.js')
//const path = require('path')
const md5 = require('blueimp-md5')
const session = require('express-session')


const router = express.Router()

router.get('/', userController.postLogin);

router.get('/login', function (req, res) {
  res.render('login.html')
})

router.post('/login', function (req, res) {
 
  var body = req.body

  User.findOne({
    email: body.email,
    password: md5(md5(body.password))
  }, function (err, user) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: err.message
      })
    }
    
 
    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or password is invalid.'
      })
    }


    req.session.user = user

    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})

router.get('/register', function (req, res) {
  res.render('register2',{status:'A member'})
})

router.post('/register', function (req, res) {
  
  var body = req.body
  User.findOne({
    $or: [{
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  }, function (err, data) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: '服务端错误'
      })
    }

    if (data) {
   
      return res.status(200).json({
        err_code: 1,
        //message: 'Email or nickname aleady exists.'
      })
      return res.send(`Email or User name has existed`)
    }

    body.password = md5(md5(body.password))

    new User(body).save(function (err, user) {
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: 'Internal error.'
        })
      }

      
      req.session.user = user

   
      res.status(200).json({
        //err_code: 0,
       // message: 'OK'
      })

    })
  })
})

router.get('/logout', function (req, res) {

  req.session.user = null

  res.redirect('/login')
})


module.exports = router
