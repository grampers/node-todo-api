const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');

const { app } = require('../server');
const { Todo } = require('../../server/models/todo');




describe('Post /todos', () => {

   beforeEach(()=> {
    Todo.remove({}).then(()=> done()); 
  }); 

  it('should create a new todo', (done) => {
    var text = "Test another todo text";
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=> {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err){
          return done(err); 
        }
        Todo.find().then(
          (todos) => {
            console.log(`text is ${todos[0].text}`)
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          }).catch((error) => done(error));

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
          expect(todos.length).toBe(0);
          done();
        }).catch((e)=> done(e) );
    });

  });

});