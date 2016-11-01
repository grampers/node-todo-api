const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../../server/models/todo');

const todos = [
  {
    text: 'first todo',
    _id: new ObjectID()
  },
  {
    text: 'second todo',
    _id: new ObjectID()
  }
]


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});



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
            console.log(`text is ${todos[0].text}`)
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
    console.log(`id is ${id}`);
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