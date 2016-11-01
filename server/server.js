const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const  mongoose  = require('./db/mongoose');


var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
var port= process.env.PORT || 3000;

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



  app.post('/users', (req,res) => {
    var user = new User({
      name:  req.body.name,
      age: req.body.age,
      locaton: req.body.location,
      email: req.body.email
    });

  user.save()
  .then(
    (doc) => res.send(doc),
    (e) => res.status(400).send(`ERROR ${e}`)
    )
});



app.listen(port, () => console.log(`started on port ${ port }`));
 
module.exports = {app};
