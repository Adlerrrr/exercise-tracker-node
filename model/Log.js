const mongoose = require('mongoose')


const logSchema = {
    // by default, an _id will be added by Mongoose
    username: { type: String, required: true },
    count: { type: Number},
    log: {
      description: String,
      duration: Number,
      date: Date
    }
  }
  
const Log = mongoose.model("Log", logSchema);

module.exports = Log