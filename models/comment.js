const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    content:{
        type:String,
        required:true
    },
    postId:{
        type: Schema.Types.ObjectId,
        required: true
    }
})

const Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;