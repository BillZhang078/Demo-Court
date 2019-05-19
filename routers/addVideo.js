const express = require('express');
const userController = require('../controllers/user');
const md5 = require('blueimp-md5');
const session = require('express-session');
const uploadVideo = require('../controllers/videos').uploadVideo;
const getUploadPage= require('../controllers/videos').getUploadPage;
const getPersonalPage = require('../controllers/videos').getPersonalPage;
const getMainPage = require('../controllers/videos').getMainPage;
const deleteVidoes = require('../controllers/videos').deleteVideos;
const getSingleVideo = require("../controllers/videos").getSingleVideo;
const increaseStartNumbers = require("../controllers/videos").increaseStarNumbers;
const decreaseStarNumbers = require("../controllers/videos").decreaseStarNumbers;
const getRankedVidoes = require('../controllers/videos').getRankedVideos;
const searchVideos = require('../controllers/videos').searchVideos;
const getLikePage = require('../controllers/videos').getLikePage;
const getPosterPage = require('../controllers/videos').getPosterPage;
const getPoster = require('../controllers/videos').getPoster;
const test = require('../controllers/videos').test;

const router1 = express.Router();


router1.get('/upload',getUploadPage);
router1.post('/upload',uploadVideo);
router1.get('/personal',getPersonalPage);
router1.get('/',getRankedVidoes);
router1.post('/delete-video',deleteVidoes);
router1.get('/getSingleVideo/:videoId/',getSingleVideo);
//router1.post('/likeVideos/:videoId',increaseStartNumbers);
//router1.post('/unlikeVideos/:videoId',decreaseStarNumbers);
router1.get('/hotVideos',getRankedVidoes);
router1.get('/searchResults',searchVideos);
router1.post('/test',test);
router1.get('/likePage/',getLikePage);
router1.get('/uploadPoster',getPosterPage);
router1.post('/getTitle/:videoId/',getPoster);


//router.delete('/delete');
///router.update('/update');
//router.get('/video/:videoId');



module.exports = router1;