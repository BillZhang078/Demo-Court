//const getDb = require('../util/database').getDb;

// class User{
//     constructor(username,email,password,gender){
//         this.username = username;
//         this.email = email;
//         this.password = password;
//         this.gender = gender;
//     }
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  created_time: {
    type: Date,
    
    default: Date.now
  },
  last_modified_time: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: '/public/img/avatar-default.png'
  },
  resetToken:String,
  university:{
    type: String,
    default:''
  },
  gender: {
    type: Number,
    enum: [-1, 0, 1],
    default: -1
  },
  birthday: {
    type: Date
  },
  type:{
    type:String
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },
  university:{
    type:String,
  
  },
  description:{
    type:String,
  },
  location:{
    type:String,
  },
  phoneNumber:{
    type:String,
  },
  resume:{
    type:String,
    default:''
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Video',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  },
  likecart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Video',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
})
userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
  };
  userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
  };
  userSchema.methods.addToLikeCart = function(product) {
    const cartProductIndex = this.likecart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.likecart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = this.likecart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.likecart = updatedCart;
    return this.save();
  };
  userSchema.methods.removeFromlikeCart = function(productId) {
    const updatedlikeCartItems = this.likecart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    this.likecart.items = updatedlikeCartItems;
    return this.save();
  };
// userSchema.methods.addToCollection = function(video) {
//     const collectionVideoIndex = this.videoCollection.videos.findIndex(cv => {
//       return cv.videoId.toString() === video._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCollectionVideos = [...this.videoCollection.videos];
  
//     if (collectionVideoIndex >= 0) {
//       newQuantity = this.videoCollection.videos[collectionVideoIndex].quantity + 1;
//       updatedCollectionVideos[collectionVideoIndex].quantity = newQuantity;
//     } else {
//         updatedCollectionVideos.push({
//         productId: product._id,
//         quantity: newQuantity
//       });
//     }
//     const updatedCollection = {
//     videos: updatedCollectionVideos
//     };
//     this.videoCollection =updatedCollection;
//     return this.save();
//   };

module.exports = mongoose.model('User',userSchema);

//     .save(){
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//         .then(result=>{

//             console.log(result);
//         }

//         ).catch(err=>{

//             console.log(err);
//         });

//     };

    
// }

