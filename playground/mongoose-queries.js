const mongoose = require('../server/db/mongoose');
// const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { ObjectID } = require('mongodb');


const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');


// console.log(ObjectID.isValid(id));

// User.find({_id: id})
//   .then(
//     (users) => console.log('Users', JSON.stringify(users, undefined,2)), 
//     (e)=> console.log(`Error ${e}`)
//     );

// User.findById(id)
//   .then(
//     (users) => console.log('Users', JSON.stringify(users, undefined,2)), 
//     (e)=> console.log(`Error ${e}`)
//     );

  User.findById('580bab13938a111bcb421fe0')
    .then(
    (user) => {
      if (!user){
        return console.log('That id not in database');
      }
      console.log('User', JSON.stringify(user, undefined,2));
    }, 
    (e) => {
      if (!ObjectID.isValid(id)){
        console.log(`id is not valid`);
      }
      
    }
    );
