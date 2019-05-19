const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jobSchema = new Schema({

    title:{
        type:String,
        required:true
    },

    position:{
        type:String,
       
    },
    category:{
        type:String,
        reuqired:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    workType:{
        type:String,
        required:true
    },
    created_time: {
        type: Date,
        
        default: Date.now
      },
      requirement:{
        type:String,
        required:true
      },
    company:{
        name:{
            type:String,
            required:true
        },
        avatar:{
            type:String,
            required:true
        },
        companyId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'User'
        }
    }
})

const Job = mongoose.model('Job',jobSchema);

module.exports = Job;