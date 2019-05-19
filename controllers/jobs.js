const Job = require('../models/jobs');
const Company = require('../models/jobs');
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
exports.getPostJob = (req,res,next)=>{
    const jobTitle = req.body.jobtitle;
    const category = req.body.category;
    const discription = req.body.description;
    const location = req.body.location;
    const workType = req.body.workType;
    const requirement = req.body.requirement

    const company = {
        name:req.user.username,
        avatar:req.user.avatar,
        companyId:req.user
    }

    const newJob = new Job({
        title:jobTitle,
        category:category,
        description:discription,
        location:location,
        workType:workType,
        company:company,
        requirement:requirement
        
    })
    newJob.save()
    .then(result=>{
        req.user.addToCart(newJob);
        res.redirect('/getJobs/1');
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getAllJobs = (req,res,next)=>{
    const perPage = 24; //max vidoes on one page
  const page = req.params.pageNumber || 1;
    Job.find()
    .skip(perPage * page - perPage)
    .sort({_id:1})
    .then(jobs=>{
        Job.countDocuments()
        .then(count=>{
            res.render("jobList",{
                jobs:jobs,
                current: page,
                pages:Math.ceil(count/perPage)
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
        Job.find({title:regex})
        .limit(8)
        .then(jobs=>{
            res.render("singleJob",{
                job:job,
                jobs:jobs
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

exports.getUploadPage = (req,res,next)=>{
    res.render('postJob');
}

exports.searchJobs = (req, res, next) => {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
      const perPage = 24; //max vidoes on one page
      const page = req.params.pageNumber || 1;
        Job.find( { $or: [ { title: regex }, { description:regex} ] } )
        .skip(perPage * page - perPage)
        .sort({_id:1})
        .then(jobs=>{
            Job.countDocuments()
            .then(count=>{
                res.render("jobSearchResults",{
                    jobs:jobs,
                    current: page,
                    pages:Math.ceil(count/perPage)
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