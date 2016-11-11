const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

// var data = {
//   id: 10
// }
// var secret = 'my brown cow';
// var token = jwt.sign(data, secret);
// console.log (`token: ${token}`);

// var decoded = jwt.verify(token, secret);
// console.log('decoded: ',decoded);

var password = 'password';

bcrypt.genSalt(10,  function(err, salt){
   bcrypt.hash(password, salt, function(err, hash){
    console.log(hash);
  })
});

bcrypt.compare(password, )