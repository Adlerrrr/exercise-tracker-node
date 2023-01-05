const mongoose = require('mongoose')


const userSchema = {
    username: {type: String, required: true}
};
const User = mongoose.model("User", userSchema);

module.exports = User