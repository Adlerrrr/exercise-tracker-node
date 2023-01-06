const mongoose = require('mongoose')


const logSchema = {
    // by default, an _id will be added by Mongoose
    username: { type: String, required: true },
    count: { type: Number, required: true},
    log: [{
      description: String,
      duration: Number,
      date: String
    }]
  }
  
const Log = mongoose.model("Log", logSchema);

module.exports = Log