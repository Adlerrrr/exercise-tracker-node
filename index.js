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
const Log = require('./model/Log');

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
app.post("/api/users", (req, res) => {
  const newLog = new Log({
    username: req.body.username,
    count: 0,
    log: [],
    since: new Date().toDateString()
  })
  newLog.save((err, data) => {
    // if (err) return console.error(err);
    return res.json({
      username: newLog.username,
      _id: newLog["_id"]
    });
  });
});


/* Getting all Users in array */

app.get('/api/users', (req, res) => {
  Log.find({}, (err, arrayOfUsers) => {
    if (!err) {
      res.json(arrayOfUsers)
    }
  })
});

/*
Failed:You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied,
the current date will be used. */
app.post('/api/users/:_id/exercises', (req, res) => {
  Log.findById(req.body[':_id'],(err, data) =>{
    if (err) {
      console.log(err)
    }else{
      res.json(data)
      // let newLog = new Log({
      //   username: data.username,
      //   description: req.body.description,
      //   duration: Number(req.body.duration),
      //   date: req.body.date,
      // });
      // console.log(newLog.username)
    }
    // newLog.save((err, result) => {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log(date.username)
        // return res.json({
        //   username: data.username,
        //   _id: req.body[':_id'],
        //   description: newLog.description,
        //   duration: newLog.duration,
        //   date: newLog.date
        // })
    //   }
    // })
  })

})
