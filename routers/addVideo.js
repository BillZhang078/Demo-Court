const express = require('express');
const userController = require('../controllers/user');
const md5 = require('blueimp-md5');
const session = require('express-session');
const uploadVideo = require('../controllers/videos').uploadVideo;
const getUploadPage= require('../controllers/videos').getUploadPage;
const getPersonalPage = require('../controllers/videos').getPersonalPage;
const getMainPage = require('../controllers/videos').getMainPage;
const deleteVidoes = require('../controllers/videos').deleteVideos;

const router1 = express.Router();


router1.get('/upload',getUploadPage);
router1.post('/upload',uploadVideo);
router1.get('/personal',getPersonalPage);
router1.get('/',getMainPage);
router1.post('/delete-video',deleteVidoes);
//router.delete('/delete');
///router.update('/update');
//router.get('/video/:videoId');



module.exports = router1;