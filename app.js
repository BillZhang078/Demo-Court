var express = require('express')
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
var ejs = require('ejs')
const User = require('./models/user');
const path = require('path')
var session = require('express-session')
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
var registerRouter = require('./routers/users')
var videosRouter = require('./routers/addVideo');
const app = express()
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
    file.mimetype === 'video/webm'
   
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};



app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('video')
);

app.use(registerRouter);
app.use(videosRouter);

mongoose
  .connect(mongodb_url,{ useNewUrlParser: true })
  .then(result => {
    app.listen(3000);
    console.log('Server is working');
  })
  .catch(err => {
    console.log(err);
  });