// config inicial
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
require('dotenv').config()

// DB
const mongoose = require("mongoose");
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('Conectou ao banco!')
  })
  .catch((err) => console.log(err))
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = {
  username: String,
};

const User = mongoose.model("User", userSchema);


//pre middleware
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
app.use(bodyParser.urlencoded({
  extended: true
}));


//api functions
/* Creating Users */
app.post('/api/users', bodyParser.urlencoded({ extended: false }), (req, res) => {
  let newUser = new User({ username: req.body.username })
  newUser.save((err, data) => {
    if (!err) {
      let resObj = {};
      resObj['username'] = data.username;
      resObj['_id'] = data.id;
      res.json(resObj)
    }
  })
});
