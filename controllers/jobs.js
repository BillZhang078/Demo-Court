const Job = require('../models/jobs');
const Company = require('../models/jobs');
const marked = require('marked')
const User = require('../models/user');
var session = require('express-session')
var ObjectId = require('mongodb').ObjectID;

const moment = require('moment');
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
exports.getPostJob = (req,res,next)=>{
    
    const jobTitle = req.body.jobtitle;
    const category = req.body.category;
    //const discription = req.body.description;
    const location = req.body.location;
    const workType = req.body.workType;
    const requirement = req.body.requirement
    const discription = marked(req.body.description)
    const company = {
        name:req.user.username,
        avatar:req.user.avatar,
        userId:req.user
    }
    console.log(company);
    const newJob = new Job({
        title:jobTitle,
        category:category,
        description:discription,
        location:location,
        workType:workType,
        User:company,
        requirement:requirement,
        username:req.user.username,
        userDescription:req.user.description
        
    })
    newJob.save()
    .then(result=>{
        req.user.addToJob(newJob);
        res.redirect('/getJobs/1');
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getAllJobs = (req,res,next)=>{
    const perPage = 12; //max vidoes on one page
  const page = req.params.pageNumber || 1;
    Job.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({_id:1})
    .then(jobs=>{
        Job.countDocuments()
        .then(count=>{
            res.render("jobList",{
                jobs:jobs,
                current: page,
                pages:Math.ceil(count/perPage),
                user:req.user
            })
        })
       .catch(err=>{
           console.log(err);
       })
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getSingleJob = (req,res,next)=>{
   
    
    const jobId = req.params.jobId;
    Job.findById(jobId)
    .then(job=>{
        regex = new RegExp(escapeRegex(job.title), "gi");
        const userId = job.User.userId;
      console.log(userId);
      let urlArray = new Array();
      User.findById(userId).then(user => {
        user
          .populate("jobs.items.jobId")
          .execPopulate()
          .then(user=>{
            description = job.description;
              const jobs = user.jobs.items;
              res.render('singleJob',{
                  job:job,
                description:description,
                  jobs:jobs,
                  user:req.user,
                  moment:moment
              })
          })
      })
    })
    .catch(err=>{
        console.log(err);

    })
}

exports.getUploadPage = (req,res,next)=>{
    res.render('postJob',{
        user:req.user
    });
}

exports.searchJobs = (req, res, next) => {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
      const perPage = 24; //max vidoes on one page
      const page = req.params.pageNumber || 1;
        Job.find( { $or: [ { title: regex }, { description:regex},{username:regex},{userDescription:regex} ] } )
        .skip(perPage * page - perPage)
        .sort({_id:1})
        .then(jobs=>{
            Job.countDocuments()
            .then(count=>{
                res.render("jobSearchResults",{
                    jobs:jobs,
                    current: page,
                    pages:Math.ceil(count/perPage),
                    user:req.user
                })
            })
           .catch(err=>{
               console.log(err);
           })
        })
        .catch(err=>{
            console.log(err);
        })
  };
  exports.deleteJobs = (req, res, next) => {
    const prodId = req.params.jobId;
    console.log(prodId);
    req.user
      .removeFromJob(prodId)
      .then(() => {
        Job.findByIdAndRemove(prodId)
          .then(() => {
            console.log("Delete Successfully");
          })
          .catch(err => {
            console.log(err);
          });
  
        res.redirect("/companyPage");
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };
  
  exports.editJob = (req,res,next)=>{
    const prodId = req.params.jobId;
    console.log(prodId);
    Job.findById(prodId)
    .then(job=>{
        res.render('editjob',{
           job:job,
           user:req.user
        })
    })
    .catch(err=>{
        console.log(err);
    })
  }
  exports.updateJob = (req, res, next) => {
    const prodId = req.body.JobId;
    console.log(prodId);
    req.user
      .removeFromCart(prodId)
      .then(() => {
        Job.findByIdAndRemove(prodId)
          .then(() => {
            console.log("Delete Successfully");
          })
          .catch(err => {
            console.log(err);
          });
  
        res.redirect("/company");
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  exports.getCompanyProfilePage = (req,res,next)=>{
  
    if(!req.session.isLoggedIn){
      return res.redirect('/login');
    }
    res.render('editcompanyprofile',{
        discription: req.user.description,
        name:req.user.username,
        website:req.user.website,
        phoneNumber:req.user.phoneNumber,
        location:req.user.location,
        avatar:req.user.avatar,
        createTime:moment(req.user.created_time).format('LL')
    });
}

exports.EditTitle = (req, res, next) => {
    const content = req.body.content;
    console.log(content);
    const jobId = req.params.jobId;
    console.log(jobId);
   
    Job.findById(jobId)
      .then(job => {
        job.title = content;
        return job.save();
      })
      .then(result => {
        const newId = ObjectId(jobId).toString();
        console.log('UPDATED Profile!');
        res.redirect('/editJob/'+newId);
      })
      .catch(err => console.log(err));
  };

  exports.EditLocation = (req, res, next) => {
    const content = req.body.content;
    console.log(content);
    const jobId = req.params.jobId;
    console.log(jobId);
   
    Job.findById(jobId)
      .then(job => {
        job.location = content;
        return job.save();
      })
      .then(result => {
        const newId = ObjectId(jobId).toString();
        console.log('UPDATED Profile!');
        res.redirect('/editJob/'+newId);
      })
      .catch(err => console.log(err));
  };

  exports.EditCategory = (req, res, next) => {
    const content = req.body.content;
    console.log(content);
    const jobId = req.params.jobId;
    console.log(jobId);
   
    Job.findById(jobId)
      .then(job => {
        job.category = content;
        return job.save();
      })
      .then(result => {
        const newId = ObjectId(jobId).toString();
        console.log('UPDATED Profile!');
        res.redirect('/editJob/'+newId);
      })
      .catch(err => console.log(err));
  };

  exports.EditWorkType= (req, res, next) => {
    const content = req.body.content;
    console.log(content);
    const jobId = req.params.jobId;
    console.log(jobId);
   
    Job.findById(jobId)
      .then(job => {
        job.workType = content;
        return job.save();
      })
      .then(result => {
        const newId = ObjectId(jobId).toString();
        console.log('UPDATED Profile!');
        res.redirect('/editJob/'+newId);
      })
      .catch(err => console.log(err));
  };


  exports.EditDescription= (req, res, next) => {
    const content = req.body.content;
    console.log(content);
    const jobId = req.params.jobId;
    console.log(jobId);
   
    Job.findById(jobId)
      .then(job => {
        job.description = content;
        return job.save();
      })
      .then(result => {
        const newId = ObjectId(jobId).toString();
        console.log('UPDATED Profile!');
        res.redirect('/editJob/'+newId);
      })
      .catch(err => console.log(err));
  };


  exports.EditRequirement= (req, res, next) => {
    const content = req.body.content;
    console.log(content);
    const jobId = req.params.jobId;
    console.log(jobId);
   
    Job.findById(jobId)
      .then(job => {
        job.requirement = content;
        return job.save();
      })
      .then(result => {
        const newId = ObjectId(jobId).toString();
        console.log('UPDATED Profile!');
        res.redirect('/editJob/'+newId);
      })
      .catch(err => console.log(err));
  };
//   exports.getCompanyPage = (res,req,next)=>{
//       console.log(req.user);
//     req.session.user
//     .populate("job.items.jobId")
//     .execPopulate()
//     .then(user => {
//       const products = user.job.items;
//       console.log(products);
//       products.forEach(element => {
//        // console.log(element.productId);
//       });
//       res.render("companyPage", {
//         username: req.user.username,
//         products: products,
//         //number: products.length,
//         //resume:req.user.resume,
//         //image: req.user.avatar,
//         description: req.user.description,
//         avatar: req.user.avatar,
//         isAuthor: true,
//         email: req.user.email,
//         moment:moment
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
//   }
exports.getCompanyAccountPage = (req,res,next)=>{
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
    return res.render("editCompanyAccount.ejs",{
      errorMessage:message,
      email:req.user.email,
      user:req.user,
      createTime:moment(req.user.created_time).format('LL')
    });
  }