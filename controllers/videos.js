const Video = require('../models/videos');
const User = require('../models/user');


exports.getUploadPage = (req,res,next)=>{
    res.render('uploadPage');
}
exports.getPersonalPage = (req,res,next)=>{
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      products.forEach(element => {
          console.log(element.productId.VideoUrl);
      });
      res.render('personalPage', {
        username: req.user.username,
        products: products,
        number: products.length,
        image:req.user.avatar,
        description:req.user.description

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
}
exports.getMainPage = (req,res,next)=>{
    Video.find()
    .then(videos => {
        console.log(videos);
        res.render('main',{
           
            LoggedIn: req.session.isLoggedIn,
            videos:videos
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postVideos = (req,res,next)=>{
    Video.find()
}

exports.uploadVideo = (req,res,next)=>{
    const title = req.body.title;
    const description = req.body.description;
    const Imageurl = req.file;
    const starNumbers = '0';
    const clickRate = '0';
    const url = Imageurl.path;
    const user = {
       username:req.user.username,
       userId:req.user
    };
    const video = new Video({
        title:title,
        description:description,
        starNumbers:starNumbers,
        clickRate:clickRate,
        VideoUrl:url,
        user:user
    });
    video.save()
    .then(result=>{
        req.user.addToCart(video);
        console.log('Upload Successfully');
        res.redirect('/personal');
    })
    .catch(err=>{

        console.log(err);
    })
}
exports.getVideos = (req, res, next) => {
   Video.find()
      .then(videos => {
        console.log(videos);
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  exports.deleteVideos = (req,res,next)=>{
    const prodId = req.body.productId;
    console.log(prodId);
    req.user.removeFromCart(prodId)
      .then(() => {
        Video.findByIdAndRemove(prodId).then(()=>{
            console.log('DESTROYED PRODUCT');
        }).catch(err=>{
            console.log(err);
        })
        
        res.redirect('/personal');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }

