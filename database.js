/**
 * Created by aayusharora on 7/9/18.
 */
const mysql = require('mysql');
const operations = require('./operations');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'ayush',
    password : '1234',
    database : 'todo'
});


function connectDb() {
   connection.connect();
    /*
    *
    *
    * To introduce modularity we seperate the quries to the database
    * from the actual connection to the database by introducing the operations.js file
    *
    * */
    /*connection.query('SELECT * FROM TASK', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
    });*/


    /*
    *
    * display is called from the server.js since we need to send data to the client
    *
    * */
    // display();
}


function display(data) {
    operations.todo(connection, function (results) {
        data (results);
    });
}

function add (name, done, callb) {
    console.log(name, done);
    operations.add (connection, name, done, function (results) {
        callb(results);
    });
}

function deleteEle (ind) {
    operations.deleteEle(connection, ind, function (results) {
        console.log(results);
    });
}

function update (id, newval, done, callback) {
    operations.update(connection, id, done, newval, function (results) {
        callback(results);
    });
}

function deleteMultiple (id) {
    console.log(id);
    operations.deleteMultiple(connection, id, function (results) {
        console.log(results);
    })
}

module.exports = {
    connectDb,
    display,
    add,
    deleteEle,
    update,
    deleteMultiple
};