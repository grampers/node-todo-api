require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const  mongoose  = require('./db/mongoose');

const {authenticate} = require('./middleware/authenticate');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

app.use(bodyParser.json());
  
app.get('/todos', (req,res) => {
  Todo.find()
  .then(
    (todos) => res.send({todos}),
    (e) => res.status(400).send(`Error: ${e}`));
});

app.get('/todos/:id', (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then(
    (todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
});

app.post('/todos', (req,res) => {
  var todo = new Todo({
    text: req.body.text
  });
  // console.log(req.body);
  todo.save().then(
    (doc) => res.send(doc),
    (e) => res.status(400).send(`ERROR ${e} `)
    )
});



//DELETE TODOS BY ID
app.delete('/todos/:id', (req,res)=> {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id)
    .then(
      (todo) => {
        if (!todo){
          return res.status(404).send('todo not removed');
        }
        res.status(200).send({todo});
      })
      .catch((e) => res.status(400).send('problem somewhere'));

});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

//POST NEW USER
  app.post('/users', (req,res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);


    user.save().then(
      () =>  {
        return user.generateAuthToken();
      }).then (
        (token) => {
          res.header("x-auth", token).send(user);
      })
      .catch((e) => {
        res.status(400).send(e);
      });
});



// sample private route which gets authenticated user
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


var port = process.env.PORT;
app.listen(port, () => console.log(`started on port ${ port }`));
module.exports = {app};
