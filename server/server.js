const express = require('express');
const bodyParser = require('body-parser');

const  mongoose  = require('./db/mongoose');


var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

app.use(bodyParser.json());
  
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
app.listen(3000, () => console.log('started on port 3000'));

module.exports = {app};