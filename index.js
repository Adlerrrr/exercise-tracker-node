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
const User = require('./model/Users');
const Exercise = require('./model/Exercises');

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


/* Getting all Users in array */

app.get('/api/users', (req, res) => {
  User.find({}, (err, arrayOfUsers) => {
    if (!err) {
      res.json(arrayOfUsers)
    }
  })
});

/* 
Failed:You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, 
the current date will be used. */
app.post('/api/users/:_id/exercises', (req, res) => {
  let currentDate = new Date().toJSON().slice(0, 10);
  let date;
  if (req.body.date === '') {
    date = currentDate;
  } else {
    date = req.body.date
  };
  let newExercise = new Exercise({
    description: req.body.description,
    duration: req.body.duration,
    date: date
  })
  newExercise.save((err, result) => {
    if (!err) {
      res.json({
        description: req.body.description,
        duration: req.body.duration,
        date: date
      })
    }
  })
})