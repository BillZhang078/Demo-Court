var mongoose = require('mongoose')
var Schema = mongoose.Schema

const companySchema = new Schema({
    name :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    jobs: {
        items: [
          {
            jobId: {
              type: Schema.Types.ObjectId,
              ref: 'Job',
              required: true
            },
            quantity: { type: Number, required: true }
          }
        ]
      }

})

userSchema.methods.addToJob = function(job) {
    const jobIndex = this.jobs.items.findIndex(cp => {
      return cp.jobId.toString() === job._id.toString();
    });
    let newQuantity = 1;
    const updatedJobItems = [...this.jobs.items];
  
    if (jobIndex >= 0) {
      newQuantity = this.jobs.items[jobIndex].quantity + 1;
      updatedJobItems[jobIndex].quantity = newQuantity;
    } else {
      updatedJobItems.push({
        jobId: job._id,
        quantity: newQuantity
      });
    }
    const updatedJobs = {
      items: updatedJobItems
    };
    this.jobs = updatedJobs;
    return this.save();
  };