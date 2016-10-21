const {MongoClient, ObjectID }= require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Could not connect to mongodb server');
  }
  console.log('connected to mongodb servre');

  db.collection('Users').findOneAndDelete({_id: 
    new ObjectID('5809507f7468321c5f3ced61')})
  .then(
      (res) => console.log('deletion done successfully',JSON.stringify(res, undefined, 2),
      (err) => console.log('err',err)
    )

  // db.close();


});



