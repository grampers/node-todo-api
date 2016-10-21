const {MongoClient, ObjectID }= require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Could not connect to mongodb server');
  }
  console.log('connected to mongodb servre');

  // db.collection('Todos').findOneAndUpdate(
  //   {
  //       text: "Get a life"
  //   },
  //   {
  //     $set: {
  //       completed: true
  //     }
  //   },
  //   {
  //    returnOriginal: false
  //   }
  //  )

  db.collection('Users').findOneAndUpdate(
    { 
        name: 'Duncan'
    },
    { 
      $set: {
       name: 'Emily' 
      },

      $inc: {
        age: +1
      }
    },
    {
      returnOriginal: false
    }
    )
  .then(
      (res) => console.log('update done successfully',res),
      (err) => console.log('err',err)
    )

  // db.close();


});



