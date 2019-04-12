var mongoose = require('mongoose')
var Schema = mongoose.Schema

// class Video{

//     constructor(title,description,userId,url,starNumbers,visitTimes){

//         this.title = title;
//         this.description = description;
//         this.userId = userId;
//         this.url = url;
//         this.starNumbers = starNumbers;
//         this.visitTimes = visitTimes;
//     }
const videoSchema = new Schema({
    title:{
        type:String,
        rquired:true
    },
    description:{
        type:String,
        required:true
    },
    VideoUrl:{
        type:String,
        required:true
    },
    starNumber:{
        type:Number,
        default:0
    },
    visitTimes:{
        type:Number,
        default:0
    },
    user:{
        username:{
            type:String,
            required:true
        },
        userId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'User'
        }
    }

});
    

const video = mongoose.model('Video',videoSchema);
module.exports = video;