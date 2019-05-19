const Video = require("../models/videos");
const User = require("../models/user");
const moment = require('moment');
var Pusher = require('pusher');
const RankedVideo = require("../models/rankedVideo");
const Comment = require("../models/comment");
require('dotenv').config();
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

exports.getUploadPage = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("uploadPage");
};
exports.getPersonalPage = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      console.log(products);
      products.forEach(element => {
       // console.log(element.productId);
      });
      res.render("personalPage", {
        username: req.user.username,
        products: products,
        number: products.length,
        resume:req.user.resume,
        image: req.user.avatar,
        description: req.user.description,
        avatar: req.user.avatar,
        isAuthor: true,
        email: req.user.email,
        moment:moment
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // res.render('personal',{
  //     image:req.session.user.avatar,
  //     name:req.session.user.username

  // });
};
exports.getMainPage = (req, res, next) => {
  Video.find()
    .then(videos => {
      //console.log(videos);
      res.render("main", {
        LoggedIn: req.session.isLoggedIn,
        isRanked: false,
        videos: videos,
        pages: 0
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// exports.getRankPage = (req, res, next) => {
//   //console.log("page1");
//   const perPage = 3; //max vidoes on one page

//   const page = req.params.pageNumber || 1;
//   console.log(page);
//   Video.find({})
//     .skip(perPage * page - perPage) //for each page we should skip this values
//     .limit(perPage)

//     .then(videos => {
//       let video = videos;
//       Video.countDocuments()
//         .then(count => {
//           res.render("main", {
//             videos: video,
//             current: page,
//             isRanked: true,
//             LoggedIn: true,
//             pages: Math.ceil(count / perPage)
//           });
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.getDeepLearningPage = (req, res, next) => {
//   //console.log("page1");
//   const perPage = 3; //max vidoes on one page

//   const page = req.params.pageNumber || 1;
//   console.log(page);
//   Video.find({})
//     .skip(perPage * page - perPage) //for each page we should skip this values
//     .limit(perPage)

//     .then(videos => {
//       let video = videos;
//       Video.countDocuments()
//         .then(count => {
//           res.render("main", {
//             videos: video,
//             current: page,
//             isRanked: true,
//             LoggedIn: true,
//             pages: Math.ceil(count / perPage)
//           });
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.getRoboticPage = (req, res, next) => {
//   //console.log("page1");
//   const perPage = 3; //max vidoes on one page

//   const page = req.params.pageNumber || 1;
//   console.log(page);
//   Video.find({})
//     .skip(perPage * page - perPage) //for each page we should skip this values
//     .limit(perPage)

//     .then(videos => {
//       let video = videos;
//       Video.countDocuments()
//         .then(count => {
//           res.render("main", {
//             videos: video,
//             current: page,
//             isRanked: true,
//             LoggedIn: true,
//             pages: Math.ceil(count / perPage)
//           });
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.getDeepLearningPage = (req, res, next) => {
//   //console.log("page1");
//   const perPage = 3; //max vidoes on one page

//   const page = req.params.pageNumber || 1;
//   console.log(page);
//   Video.find({})
//     .skip(perPage * page - perPage) //for each page we should skip this values
//     .limit(perPage)

//     .then(videos => {
//       let video = videos;
//       Video.countDocuments()
//         .then(count => {
//           res.render("main", {
//             videos: video,
//             current: page,
//             isRanked: true,
//             LoggedIn: true,
//             pages: Math.ceil(count / perPage)
//           });
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

exports.postLike = (req, res, next) => {};

exports.uploadVideo = (req, res, next) => {
  console.log(req.body);
  const title = req.body.title;
  const description = req.body.description;
  console.log(description);
  const Imageurl = req.file;
  const starNumbers = "0";
  const clickRate = "0";
  const url = Imageurl.path;
  const user = {
    username: req.user.username,
    userId: req.user
  };
  const video = new Video({
    title: title,
    description: description,
    starNumbers: starNumbers,
    clickRate: clickRate,
    VideoUrl: url,
    user: user
  });
  video
    .save()
    .then(result => {
      req.user.addToCart(video);
      console.log(result);
      res.render('poster',{
          newVideo:video
      })
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getVideos = (req, res, next) => {
  Video.find()
    .limit(12)
    .then(videos => {
      console.log(videos);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteVideos = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  req.user
    .removeFromCart(prodId)
    .then(() => {
      Video.findByIdAndRemove(prodId)
        .then(() => {
          console.log("Delete Successfully");
        })
        .catch(err => {
          console.log(err);
        });

      res.redirect("/personal");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSingleVideo = (req, res, next) => {
  const videoId = req.params.videoId;
  Video.findById(videoId)
    .then(video => {
      video.visitTimes = video.visitTimes + 1;
      video
        .save()
        .then()
        .catch(err => {
          console.log(err);
        });
      const userId = video.user.userId;
      console.log(userId);
      let urlArray = new Array();
      User.findById(userId).then(user => {
        user
          .populate("cart.items.productId")
          .execPopulate()
          .then(user => {
            const videos = user.cart.items;
            // return res.render("videoPlay", {
            //   video: video,
            //   urlArray: videos
            // });
            req.user
              .populate("likecart.items.productId")
              .execPopulate()
              .then(user => {
                Comment.find({postId:videoId})
                .populate({path:'author',model:'User'})
                .sort({_id:1})
                .then(comments=>{
                    
                    const likeVideos = user.likecart.items;
                if (likeVideos.length == 0) {
                  global.isliked = false;
                }
                for (let i = 0; i < likeVideos.length; i++) {
                  if (likeVideos[i].productId.VideoUrl === video.VideoUrl) {
                    global.isliked = true;
                    break;
                  } else global.isliked = false;
                }
               
             
                return res.render("videoPlay", {
                  video: video,
                  urlArray: videos,
                  isliked: global.isliked,
                  //comments:comments

                });
                    
              })
                
              })
              .catch(err => {
                console.log(err);
              });
          });
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.increaseStarNumbers = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
      }
  const videoId = req.params.videoId;
  let path = videoId.toString();
  console.log("Cool");

  Video.findById(videoId)
    .then(video => {
      if (!video) {
        return res.status(500).send("Find Nothing");
      }
      //console.log(newNumber);
      video.starNumber = video.starNumber + 1;
      if (video.starNumber > 1) {
        const newVideo = new RankedVideo();
        newVideo._id = video._id;
        newVideo.starNumber = video.starNumber;
        newVideo.popularity = video.popularity;
        newVideo.title = video.title;
        newVideo.description = video.description;
        newVideo.VideoUrl = video.VideoUrl;
        newVideo.user = video.user;
        newVideo
          .save()
          .then(result => {
            console.log("Move to a new collection");
          })
          .catch(err => {
            console.log(err);
          });
      }
      console.log(video.starNumber);
      video
        .save()
        .then(result => {
          req.user.addToLikeCart(video);
          console.log("Add to your LikeCart");
        })
        .catch(err => {
          console.log(err);
        });
    })
    .then(result => {
        pusher.trigger('post-events', 'postAction', { action: action, postId: req.params.videoId }, req.body.socketId);
        res.send('');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.decreaseStarNumbers = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
      }
  console.log(req.params);
  const videoId = req.params.videoId;
  Video.findById(videoId)
    .then(video => {
      if (!video) {
        return res.status(500).send("Find Nothing");
      }
      //console.log(newNumber);
      video.starNumber = video.starNumber - 1;
      if (video.starNumber > 1) {
        const newVideo = new RankedVideo();
        newVideo._id = video._id;
        newVideo.starNumber = video.starNumber;
        newVideo.popularity = video.popularity;
        newVideo.title = video.title;
        newVideo.description = video.description;
        newVideo.VideoUrl = video.VideoUrl;
        newVideo.user = video.user;
        newVideo
          .save()
          .then(result => {
            console.log("Move to a new collection");
          })
          .catch(err => {
            console.log(err);
          });
      }
      console.log(video.starNumber);
      video
        .save()
        .then(result => {
          req.user.removeFromlikeCart(video._id);
          console.log("Remove from your LikeCart");
        })
        .catch(err => {
          console.log(err);
        });
    })
    .then(result => {
      //res.status(200).send("OK");
      res.redirect("/likepage");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getRankedVideos = (req, res, next) => {
  let rankedVideo = new Array();
  let deepLearning = new Array();
  let computerVision = new Array();
  let robotic = new Array();
  Video.find()
    .sort({ starNumber: -1 })
    .limit(8)
    .then(videos1 => {
      //console.log(videos);
      rankedVideo = videos1;
      //console.log(rankedVideo);
      let regex = new RegExp(escapeRegex("deep", "learning"), "gi");
      Video.find({ title: regex })
        .sort({ starNumber: -1 })
        .then(videos2 => {
          deepLearning = videos2;
          regex = new RegExp(escapeRegex("computer", "vision"), "gi");
          Video.find({ title: regex })
            .sort({ starNumber: -1 })
            .then(videos3 => {
              computerVision = videos3;
              regex = new RegExp(escapeRegex("robot"), "gi");
              //console.log(rankedVideo);
              Video.find({ title: regex })
                .sort({ starNumber: -1 })
                .then(videos4 => {
                  robotic = videos4;
                  console.log(rankedVideo.length);
                  console.log(computerVision.length);
                  console.log(deepLearning.length);
                  console.log(robotic.length);
                  return res.render("main", {
                    rankedVideoLength: rankedVideo.length,
                    computerVisionLength: computerVision.length,
                    deepLearningLength: deepLearning.length,
                    roboticLength: robotic.length,
                    rankedVideo: rankedVideo,
                    computerVision: computerVision,
                    deepLearning: deepLearning,
                    robotic: robotic,
                    LoggedIn: req.session.isLoggedIn,
                    isRanked: true,
                    isPaginationP: false,
                    isPaginationD: false,
                    isPaginationV: false,
                    isPaginationR: false,
                    isDeep: true,
                    isVision: true,
                    isRobotic: true,
                    pages: 0,
                    moment:moment
                  });
                })
                .catch(err => {
                  const error = new Error(err);
                  error.httpStatusCode = 500;
                  console.log(error);
                });
            })
            .catch(err => {
              const error = new Error(err);
              error.httpStatusCode = 500;
              console.log(error);
            });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          console.log(error);
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.searchVideos = (req, res, next) => {
  const regex = new RegExp(escapeRegex(req.query.search), "gi");
  Video.find({ title: regex })
    .then(videos => {
      res.render("searchResults", {
        videos: videos,
        moment:moment
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(error);
    });
};
exports.test = (req, res, next) => {
  console.log(req.body.title);
  res.render("test1");
};
exports.getLikePage = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
      }
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  req.user
    .populate("likecart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.likecart.items;
      products.forEach(element => {
        console.log(element.productId.VideoUrl);
      });
      res.render("likePage", {
        username: req.user.username,
        products: products,
        number: products.length,
        image: req.user.avatar,
        description: req.user.description,
        avatar: req.user.avatar,
        isAuthor: true,
        email: req.user.email
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getPosterPage = (req,res,next)=>{
    res.render("poster");
}

exports.getPoster = (req,res,next)=>{
    const videoId = req.params.videoId;
    const title = req.body.title;
    const description = req.body.description;
    console.log(title);
    Video.findById(videoId)
    .then(video=>{
        video.title = title;
        video.description = description;
        video.save()
        .then(result=>{
            res.redirect('/personal');
        })
        .catch(err=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err);
    })
}
