const server = require('express');
const app = server();


const bodyParser = require('body-parser');

/*
*
* This file creates the connection to the database
*
* */
const db = require('./database');



// parse application/x-www-form-urlencoded
app.use('/',server.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());


/*
*
* since the elements are not stored on the server
* we dont need todoList[]
*
* */
// var todoList = [];


app.post('/add', function(req,res) {
    let todo = req.body.todo.task;
    console.log(todo);
    let done = true;

    /*
    *
    * This send the new todo
    * entry in the database
    * and return the id of the data element
    * in the database
    *
    *
    * */

    db.add(todo, done, function (results) {
        res.send(results.insertId.toString());
    });
});

/*
*
*
* */
app.post('/delete', function(req,res){
    let index = req.body.id;
    /*
    *
    * This deletes the index
    *
    *
    * */
    db.deleteEle(index);
    res.sendStatus(200);
});

app.get('/display', function(req,res) {
    // Send TodoList Array to the client
    // res.send(todoList);
    /*
    *
    * since we need to send the data from the data base we can use telescoping
    * that calls the display () in the database.js
    *
    * */
    db.display(function (data) {
        res.send(data);
    })
});

app.post ('/update', function (req, res) {
    let newval = req.body.val;
    let ind = req.body.index;
    let done = false;


    db.update(ind, newval, done, function () {
        res.send(newval.toString());
    })
});

app.post ('/deleteMultiple', function (req, res) {
    let id = req.body.id;
    console.log(id);
    db.deleteMultiple(id);
    res.sendStatus(200);
});

app.listen(5000, function(req,res) {
   console.log("Server running on port 5000");
   db.connectDb();
});