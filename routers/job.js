const express = require('express')
const router = express.Router();
const getPostJob = require('../controllers/jobs').getPostJob;
const getJobList = require('../controllers/jobs').getAllJobs;
const getSingleJob = require('../controllers/jobs').getSingleJob;
const getPostPage = require('../controllers/jobs').getUploadPage;
const getSearchJobs = require('../controllers/jobs').searchJobs;
const getCompanyAccountPage = require('../controllers/jobs').getCompanyAccountPage;
const getCompanyProfilePage = require('../controllers/jobs').getCompanyProfilePage;
const deleteJob  = require('../controllers/jobs').deleteJobs;
const editJob = require('../controllers/jobs').editJob
const getCompanyProfile = require('../controllers/jobs').getCompanyProfilePage
const EditTitle = require('../controllers/jobs').EditTitle;
const EditLocation = require('../controllers/jobs').EditLocation;
const EditCategory = require('../controllers/jobs').EditCategory
const EditWorkType = require('../controllers/jobs').EditWorkType
const EditDescription = require('../controllers/jobs').EditDescription
const EditRequirement = require('../controllers/jobs').EditRequirement
const EditWebsite = require('../controllers/jobs').EditWebsite
router.post('/postjob',getPostJob);
router.get('/getJobs/:pageNumber',getJobList);
router.get('/job/:jobId',getSingleJob);
router.get('/postJob',getPostPage);
router.get('/deletejob/:jobId',deleteJob);
router.get('/jobSearchResults',getSearchJobs);
router.get('/editJob/:jobId',editJob);
router.get('/companyProfile',getCompanyProfile);
router.post('/editTitle/:jobId',EditTitle);
router.post('/editLocation/:jobId',EditLocation);
router.post('/editWorkType/:jobId',EditWorkType);
router.post('/editCategory/:jobId',EditCategory);
router.post('/editDescription/:jobId',EditDescription);
router.post('/editRequirement/:jobId',EditRequirement);
router.get('/companyAccount',getCompanyAccountPage);
//router.get('/companyProfile',getCompanyAccountPage);
//router.get('/companyPage',getCompanyPage);

module.exports = router;