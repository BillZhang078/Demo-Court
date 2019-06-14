var express = require('express')
var bodyParser = require('body-parser');
const video = require('video.js');
const mongoose = require('mongoose');
const Video = require("./models/videos");
const multer = require('multer');
var ejs = require('ejs')
const User = require('./models/user');
const RankedVideo = require("./models/rankedVideo");
const path = require('path')
var session = require('express-session')
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
var registerRouter = require('./routers/users')
var CategoryRouter = require('./routers/category')
var videosRouter = require('./routers/addVideo');
const jobRouter = require('./routers/job');
const {check} = require('express-validator/check');
const app = express();
var Pusher = require('pusher');
const Comment = require("./models/comment");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
require('dotenv').config();
var pusher = new Pusher({
  appId: '781922',
  key: '0a886161c701a186dced',
  secret: '4cdf52d322d3817329af',
  cluster: 'ap4',
  encrypted: true
});


 
// const Uppy = require('@uppy/core')
// const Dashboard = require('@uppy/dashboard')
// const GoogleDrive = require('@uppy/google-drive')
// const Instagram = require('@uppy/instagram')
// const Webcam = require('@uppy/webcam')
// const Tus = require('@uppy/tus')
 
// const uppy = Uppy({ autoProceed: false })
//   .use(Dashboard, { trigger: '#select-files' })
//   .use(GoogleDrive, { target: Dashboard, companionUrl: 'https://companion.uppy.io' })
//   .use(Instagram, { target: Dashboard, companionUrl: 'https://companion.uppy.io' })
//   .use(Webcam, { target: Dashboard })
//   .use(Tus, { endpoint: 'https://master.tus.io/files/' })
//   .on('complete', (result) => {
//     console.log('Upload result:', result)
//   })
app.engine('ejs', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/videos',express.static(path.join(__dirname, 'videos')));
app.set('view engine','ejs')
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.set('trust proxy', 1) // trust first proxy
const mongodb_url = 'mongodb+srv://peng21:anqiwang@cluster0-qa242.mongodb.net/test?retryWrites=true';

const store = new MongoDBStore({
  uri: mongodb_url,
  collection: 'sessions'
});

app.use(session({
  secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  
  User.findById(req.session.user._id)
    .then(user => {
     
      req.user = user;
      //console.log(req.user);
      next();
    })
    .catch(err => console.log(err));
});
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos');
  },
  filename: (req, file, cb) => {
    cb(null,file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'video/mp4'||
    file.mimetype === 'video/webm'||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/bng' ||
    file.mimetype === 'application/pdf'
   
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};



  // respond with json
  
// const fileFilter1 = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/png' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/bng'
   
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const fileStorage1 = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'avatars');
//   },
//   filename: (req, file, cb) => {
//     cb(null,file.originalname);
//   }
// });


app.post('/unlikeVideos/:videoId/', (req, res, next) => {
  const action = req.body.action;
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
      pusher.trigger('post-events', { action: action, postId: req.params.videoId }, req.body.socketId);
      res.send('');
    })
    .catch(err => {
      console.log(err);
    });
})
app.post('/likeVideos/:videoId/', (req, res, next) => {
  const action = req.body.action;
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
        pusher.trigger('post-events',  { action: action, postId: req.params.videoId }, req.body.socketId);
        res.send('');
    })
    .catch(err => {
      console.log(err);
    });
});
// const upload = multer({ storage: fileStorage1, fileFilter:fileFilter1 });
app.post('/comment/:videoId', function(req, res){
  
  const newComment = {
    comment: req.body.comment
  }
  const comment = new Comment({
    content:req.body.comment,
    postId :req.params.videoId,
    author:req.user._id

  })
  
  comment.save()
  .then()
  .catch(err=>{
    console.log(err);
  })
  pusher.trigger('flash-comments', 'new_comment', newComment);
  res.json({ created: true });
});
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('video')
);
// app.use(upload.single('image'));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('video')
);
app.use(registerRouter);
app.use(videosRouter);
app.use(CategoryRouter);
app.use(jobRouter);
app.use(function (req, res) {
  if (!res.headersSent) {
    res.status(404).render('errorPage')
  }
})
mongoose
  .connect(mongodb_url,{ useNewUrlParser: true })
  .then(result => {
    app.listen(process.env.PORT ||8000);
    console.log('Server is working');
  })
  .catch(err => {
    console.log(err);
  });