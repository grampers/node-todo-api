const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../../server/models/todo');
const { User } = require('../../server/models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);


describe('Post /todos', () => {
  it('should create a new todo', (done) => {
    var text = "Test another todo text";
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=> {
        expect(res.body.text).toBe(text);
      })
      .expect((res) => {
        Todo.find({text}).then(
          (todos) => {
            // console.log(`text is ${todos[0].text}`)
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          }).catch((error) => done(error));
      })
      // .end(done);
      .end((err, res) => {
        if (err){
          return done(err); 
        }

      });
    });

  it('should not create todo if body data is invalid' ,(done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end(( err, res)=>{
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=> done(e) );
    });

  });

});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      // //.end(done); <<-- alternative to the following 5 lines
      .end((err, res)=> {
        if (err){
          return done(err);
        }
        return done();
      })
  });
});

describe('GET /todos/:id', () => {
  it ('should return 404 for invalid id', (done) => {
    var invalidId = new ObjectID().toHexString();
    var id = todos[1]._id.toHexString();
    request(app)
      .get(`/todos/invalidId`)
      .expect(404)
      .end(done);
  });

  it('should return  todo doc if given a valid id', (done) => {
    var id = todos[0]._id.toHexString();
    // console.log(`id is ${id}`);
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
        done();
      }).catch((e) => done(e));
  });

  it ('should return 404 if id not in databas', (done) => {
    var id = todos[1]._id.toHexString();
    var missingId = '6817c9f9630d5d13e70009e9';
    request(app)
      .get(`/todos/${missingId}`)
      .expect(404)
      .end(done);
  });

})

describe('DELETE /todos/:id', () => {
  it('should delete todo given valid ID', (done) => {
    var id = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.findById(id).then(
          (todo) => {
            expect(todo).toNotExist();
            done();
        }).catch((e) =>  done(e))
      })
  });

  it('should return 404 if id not found', (done) => { 
    var missingId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${missingId}`)
      .expect(404)
      .end(done)
  });

  it('should return status 404 if given invalid id' , (done)  => {
    var invalidId = 123;
    request(app)
    .delete(`/todos/${invalidId}`)
    .expect(404)
    .end(done)
  });
});


describe('PATCH/todos/:id' ,() => {
  it('should update todo given valid id' , (done) => {
    var id = todos[0]._id.toHexString();
    // console.log(todos[0].text);

    var text = "Some new stuff for the first todo";
    request(app)
      .patch(`/todos/${id}`)
      .send({
        text: text,
        completed: false
      })
      .expect(200)
      .expect((res) => {
        // console.log(`completedAt in array ${todos[0].completedAt}`);
        // console.log(`completedAt returned in res ${res.body.todo.completedAt}`);
        // console.log(`object ${JSON.stringify(res.body.todo, undefined, 2)}`);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done)

  });

    it('should clear completedAt when todo not completed' , (done) => {
    var id = todos[1]._id.toHexString();

    var text = "Some changes for the second todo";
    request(app)
      .patch(`/todos/${id}`)
      .send({
        text: text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completedAt).toBeA('number');
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.text).toBe(text);
      })
      .end(done);

  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if user is not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res)=> {
        expect(res.body).toEqual({})
      })
      .end(done);
  });
});

//test adding a user
describe('POST/users', () => {
  it('should create a user given valid username and password', (done) => {
    var email = 'example@example.com';
    var password = 'password';
    var user = { email, password };
     request(app)
      .post('/users')
      .send(user)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);

      }).end((err)=> {
          if (err) {
            return done(err);
          }
          User.findOne({email}).then (
            (user) =>{
              expect(user).toExist();
              expect(user.email).toBe(email);
              expect(user.password).toNotBe(email);
              done();
            }
          )
      });
  });

  it('should return errors if given invalid username or password', (done) => {
    var email = 'db@example.com';
    var password = 'pass';
    var user = { email, password};
     request(app)
      .post('/users')
      .send(user)
      .expect(400)
      .end(done);
    });

  it('should not create user if email in use', (done) => {
    var email = 'jen@example.com';
    var password = users[0].password;
    var user = { email, password};
     request(app)
      .post('/users')
      .send(user)
      .expect(400)
      .end(done);
  });
});


