const Video = require("../models/videos");
const User = require("../models/user");
const RankedVideo = require("../models/rankedVideo");
const moment = require('moment');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
exports.getRankPage = (req, res, next) => {
  //console.log("page1");
  const perPage = 4; //max vidoes on one page
  const page = req.params.pageNumber || 1;
  console.log(page);
  Video.find({})
    .skip(perPage * page - perPage) //for each page we should skip this values
    .limit(perPage)

    .then(videos => {
      let video = videos;
      Video.countDocuments()
        .then(count => {
          res.render("main", {
            robotic: 0,
            rankedVideo: video,
            computerVision: 0,
            deepLearning: 0,
            rankedVideoLength: video.length,
            computerVisionLength: 0,
            deepLearningLength: 0,
            roboticLength: video.length,
            computerVisionLength: 0,
            deepLearningLength: 0,
            roboticLength: 0,
            current: page,
            isDeep: false,
            isRanked: true,
            isVision: false,
            isRobotic: false,
            LoggedIn: true,
            isPaginationP: true,
            isPaginationD: false,
            isPaginationV: false,
            isPaginationR: false,
            type:req.user.type,
            pages: Math.ceil(count / perPage),
            user:req.user,
            moment:moment
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getDeepLearningPage = (req, res, next) => {
  //console.log("page1");
  const perPage = 4; //max vidoes on one page
  regex = new RegExp(escapeRegex("deep", "learning"), "gi");
  const page = req.params.pageNumber || 1;
  console.log(page);
  Video.find( { $or: [ { title: regex }, { description:regex} ] } )
    .skip(perPage * page - perPage) //for each page we should skip this values
    .limit(perPage)
    .then(videos => {
      let video = videos;
      Video.find({ title: regex })
        .countDocuments()
        .then(count => {
          console.log(count);
          res.render("main", {
            rankedVideo: 0,
            computerVision: 0,
            deepLearning: video,
            rankedVideoLength: 0,
            computerVisionLength: 0,
            deepLearningLength: video.length,
            roboticLength: 0,
            current: page,
            isDeep: true,
            isRanked: false,
            isVision: false,
            isRobotic: false,
            isPaginationP: false,
            isPaginationD: true,
            isPaginationV: false,
            isPaginationR: false,
            type:req.user.type,
            LoggedIn: true,
            pages: Math.ceil(count / perPage),
            user:req.user,
            moment:moment
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getRoboticPage = (req, res, next) => {
  //console.log("page1");
  const perPage = 4; //max vidoes on one page
  regex = new RegExp(escapeRegex("robot"), "gi");
  const page = req.params.pageNumber || 1;
  console.log(page);
  Video.find( { $or: [ { title: regex }, { description:regex} ] } )
    .skip(perPage * page - perPage) //for each page we should skip this values
    .limit(perPage)

    .then(videos => {
      let video = videos;
      Video.find({ title: regex })
        .countDocuments()
        .then(count => {
          res.render("main", {
            robotic: video,
            rankedVideo: 0,
            computerVision: 0,
            deepLearning: 0,
            rankedVideoLength: 0,
            computerVisionLength: 0,
            deepLearningLength: 0,
            roboticLength: video.length,
            current: page,
            isDeep: false,
            isRanked: false,
            isVision: false,
            isRobotic: true,
            LoggedIn: true,
            isPaginationP: false,
            isPaginationD: false,
            isPaginationV: false,
            isPaginationR: true,
            type:req.user.type,
            pages: Math.ceil(count / perPage),
            user:req.user,
            moment:moment
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getComputerVisionPage = (req, res, next) => {
  //console.log("page1");
  const perPage = 4; //max vidoes on one page
  regex = new RegExp(escapeRegex("vision"), "gi");
  const page = req.params.pageNumber || 1;

  Video.find( { $or: [ { title: regex }, { description:regex} ] } )
    .skip(perPage * page - perPage) //for each page we should skip this values
    .limit(perPage)

    .then(videos => {
      let video = videos;
      Video.find({ title: regex })
        .countDocuments()
        .then(count => {
          res.render("main", {
            rankedVideo: {},
            computerVision: video,
            deepLearning: {},
            robotic: {},
            rankedVideoLength: 0,
            computerVisionLength: video.length,
            deepLearningLength: 0,
            roboticLength: 0,
            deeplearning: null,
            roboticVideos: null,
            rankedvideo: 0,
            current: page,
            isDeep: false,
            isRanked: false,
            isVision: true,
            isRobotic: false,
            LoggedIn: true,
            isPaginationP: false,
            isPaginationD: false,
            isPaginationV: true,
            isPaginationR: false,
            type:req.user.type,
            pages: Math.ceil(count / perPage),
            moment:moment,
            user:req.user
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};
