const express = require('express');
const userController = require('../controllers/user');
const md5 = require('blueimp-md5');
const session = require('express-session');
const register = require('../controllers/user').singUp;
const signOut = require('../controllers/user').signOut;
const registerPage = require('../controllers/user').getRegiserPage;
const loginPage = require('../controllers/user').getLoginPage;
const logIn = require('../controllers/user').singIn;
const getEditPage = require('../controllers/user').getEditPage;
const postEditProfile = require('../controllers/user').postEditProfile;
const getAuthorPage = require('../controllers/user').getAuthorPgae;
const getAccountPage = require('../controllers/user').getAccountPage;
const postNewPassword = require('../controllers/user').postNewPassword;
const EditDiscription = require('../controllers/user').EditDiscription;
const EditAvatar = require('../controllers/user').EditAvatar;
const EditUniversity = require('../controllers/user').EditUniversity;
const EditPhoneNumber = require('../controllers/user').EditPhoneNumber;
const EditLocation= require('../controllers/user').EditLocation;
const EditUserName = require('../controllers/user').EditUserName;
const getResetPage = require('../controllers/user').getResetPage;
const editEmail =  require('../controllers/user').EditEmail;
const postReset = require('../controllers/user').postReset;
const {check,body} = require('express-validator/check');
const EditResume = require('../controllers/user').EditResume;
const EditWebsite = require('../controllers/user').EditWebsite;

const router = express.Router();
const multer  = require('multer');

const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/bng' ||
      file.mimetype === 'application/pdf'
     
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'avatar');
    },
    filename: (req, file, cb) => {
      cb(null,file.originalname);
    }
  });

  const upload = multer({ storage: fileStorage, fileFilter:fileFilter });
  
router.post('/register',register);

router.get('/register',registerPage);

router.get('/login',loginPage);

router.post('/login',logIn);

router.get('/logout',signOut);

router.get('/editProfile',getEditPage);
router.post('/EditCompanyWebsite',EditWebsite);


//router.post('/edit-profile',upload.single('avatar'),postEditProfile);

router.get('/getPage/:userId',getAuthorPage);

router.get('/editAccount',getAccountPage);

router.post('/resetPassword',[body('newPassword','Please enter a password with only numbers and text and at least 8 characters.')
.isLength({min:8})
.isAlphanumeric(),
body('confirmPassword').custom((value, { req }) => {
  if (value !== req.body.newPassword) {
    throw new Error('Passwords have to match!');
  }
  return true;
})]
,postNewPassword);

router.get('/resetPage/:token',getResetPage);

router.post('/EditDiscription',EditDiscription);

router.post('/updatedAvatar',upload.single('avatar'),EditAvatar);

router.post('/EditUniversity',EditUniversity);

router.post('/EditPhoneNumber',EditPhoneNumber);

router.post('/EditLocation',EditLocation);

router.post('/EditUserName',EditUserName);

router.post('/EditEmail',body('confirmEmail').isEmail().custom((value, { req }) => {
  if (value !== req.body.newEmail) {
    throw new Error('Email have to match!');
  }
  return true;
}), editEmail);

router.post('/EditResume',EditResume);

router.post('/postReset',postReset);

module.exports = router;