const express = require('express');
const router = express.Router();

const getDeepLearning = require("../controllers/category").getDeepLearningPage;
const getComputerVision= require("../controllers/category").getComputerVisionPage;
const getRobotic = require("../controllers/category").getRoboticPage
const getRankPage = require('../controllers/category').getRankPage;

router.get('/Rankedvideos/:pageNumber',getRankPage);

router.get('/getDeepLearning/:pageNumber',getDeepLearning);

router.get('/getComputerVision/:pageNumber',getComputerVision);

router.get('/getRobotic/:pageNumber',getRobotic);




module.exports = router;