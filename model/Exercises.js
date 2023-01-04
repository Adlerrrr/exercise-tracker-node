const mongoose = require('mongoose')


const exerciseSchema = {
/*     _id: {type: String, required: true}, */
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: Date}
};
const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise