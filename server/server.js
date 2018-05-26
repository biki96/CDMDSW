const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const express = require('express');
const _ = require('lodash');




var { mongoose } = require('./../db/mongoose');
var { Room } = require('./../models/rooms');
var { User } = require('./../models/users');
var { authenticate } = require('./../middleware/authenticate'); 


var app = express();

var port = process.env.PORT || 3000;
// var port = process.env.PORT;
app.use(bodyParser.json());
// app.use(bodyParser.json({ type: 'application/*+json' }));

// app.get('/user', (req, res) => {
//   User.find().then((users) => {
//     res.send({ users });
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

app.post('/users', (req, res) => {
  // var body = { username: 'Dragana Mirkovic'};
  var body = _.pick(req.body, ['username']);
  
  console.log(body);
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/room', (req, res) => {
  var room = new Room({
    roomname: req.body.roomname,
    descriptions: req.body.descriptions,
  });

  room.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.stetus(400).send(e);
  });
});

app.listen(port, () => {
  console.log('Started on port ', port);
});