const {ObjectID } = require('mongodb');

const mongoose = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

var id = '581a14bcb088b9171971741a';

Todo.findByIdAndRemove(id).then(
  (todo) => console.log(todo.text)
  );