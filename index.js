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
app.post('/api/users/:_id/exercises', async (req, res) => {
  Log.findById(req.params._id, async (err, data) => {
    let foundUser = data.username;
    if (err) {
      console.log(err)
    } if (!foundUser) {
      console.log(err)

    } else {
      const logObj = {
        description: req.body.description,
        duration: Number(req.body.duration),
        date: req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString()
      }

      const resp = await Log.findByIdAndUpdate({ _id: req.params._id }, { $push: { log: logObj } });

      resp.save();
      res.json({
        _id: data._id,
        username: foundUser,
        date: logObj.date,
        duration: logObj.duration,
        description: logObj.description
      })
    }
  })
})


app.get('/api/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query;
  console.log(limit)

  if (!from && !to && !limit) {
    Log.findById(req.params._id, (err, userLog) => {
      if (!err) {
        let logs = userLog.log.map(x => {
          return {
            description: x.description,
            duration: x.duration,
            date: x.date.toDateString()
          }
        })
        res.json({
          _id: userLog._id,
          username: userLog.username,
          count: Object.keys(userLog.log).length,
          log: logs
        })
      }
    })
  } else {
    const startDate = new Date(from);
    const endDate = new Date(to);
    let limitNumber = 10;
    if (!isNaN(limit)) {
      limitNumber = parseInt(limit);
    }
    const _id = mongoose.Types.ObjectId(req.params._id)
    const filter = {
      _id: _id,
    };
    const resp = await Log.aggregate([
      { $match: filter },
      {
        $project: {
          _id: 1,
          username: 1,
          from: startDate.toDateString(),
          count: {
            $size: {
              $filter: {
                input: "$log",
                as: "log",
                cond: {
                  $and: [
                    { $gte: ["$$log.date", startDate] },
                    { $lte: ["$$log.date", endDate] },
                  ]
                }
              }
            }
          },
          log: {
            $filter: {
              input: "$log",
              as: "log",
              cond: {
                $and: [
                  { $gte: ["$$log.date", startDate] },
                  { $lte: ["$$log.date", endDate] },
                ]
              }
            }
          }
        }
      },
      { $limit: limitNumber }
    ])
    res.json(resp)
  }
})