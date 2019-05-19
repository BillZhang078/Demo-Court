const express = require('express')
const router = express.Router();
const getPostJob = require('../controllers/jobs').getPostJob;
const getJobList = require('../controllers/jobs').getAllJobs;
const getSingleJob = require('../controllers/jobs').getSingleJob;
const getPostPage = require('../controllers/jobs').getUploadPage;
const getSearchJobs = require('../controllers/jobs').searchJobs;

router.post('/postjob',getPostJob);
router.get('/getJobs/:pageNumber',getJobList);
router.get('/job/:jobId',getSingleJob);
router.get('/postJob',getPostPage);
router.get('/jobSearchResults',getSearchJobs);

module.exports = router;