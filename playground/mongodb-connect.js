const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Could not connect to mongodb server');
  }
  console.log('connected to mongodb server')


  db.collection('Todos').insertOne({
    text: 'Trim hedge',
    completed: false
  }, (err, result)=> {
    if (err) {
      return console.log('error with insertOne Todos collection into TodoApp',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
  });

  db.collection('Todos').insertOne({
    text: 'Cut lawn',
    completed: false
  }, (err, result)=> {
    if (err) {
      return console.log('error with insertOne Todos collection into TodoApp',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
  });

  db.collection('Todos').insertOne({
    text: 'Go out for lunch',
    completed: true
  }, (err, result)=> {
    if (err) {
      return console.log('error with insertOne Todos collection into TodoApp',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
  }); 

  db.collection('Users').insertOne({
    name: 'Duncan',
    age: 27,
    location: 'Victoria'
  }, (err, result) => {
    if (err){
      return console.log('could not insert new user collection',err);
    }
    console.log(`You inserted: ${JSON.stringify(result.ops, undefined, 2)}`);
    console.log(result.ops[0]._id.getTimestamp());
  });

  db.close();


});



