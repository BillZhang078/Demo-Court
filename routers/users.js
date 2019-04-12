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
const router = express.Router();

router.post('/register',register);
router.get('/register',registerPage);
router.get('/login',loginPage);
router.post('/login',logIn);
router.get('/logout',signOut);
router.get('/editProfile',getEditPage);
router.post('/edit-profile',postEditProfile);



module.exports = router;