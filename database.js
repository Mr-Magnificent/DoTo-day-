const mongodb = require('mongodb').MongoClient;

const uri = '';


mongodb.MongoClient.connect(uri, function(err, client) {

    if (err) {
        console.log(err);
        throw err;
    }
    let db = client.db('todo');
    
    let collection = db.collection('collection');
    
    global.insertNewUser = insertNewUser;
    global.insertTodo = insertTodo;
    global.retrieveAll = retrieveAll;
    global.deleteElement = deleteElement;
    global.updateElement = updateElement;
    global.deleteMul = deleteMul;

    function insertNewUser (userID) {
        collection.insertOne({
            user: {
                userId: userID
            }
        }, function (err) {

            if (err) {
                console.log(err);
                throw err;
            }
        })
    }

    function insertTodo (userID, task, status) {
        collection.updateOne(
            {userId: userID},
            { $set: 
                {
                    [task]: status
                }
            }
        )
    }

    function retrieveAll(userID, callback) {
        collection.find({userId: userID}).toString(function (err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
            callback(result);
        });
    }

    function deleteElement (userID, task) {
        collection.updateOne(
            {userId: userID},
            {$unset:
                    {
                        [task]: ""
                    }
            }
        )
    }

    function updateElement (userID, task ,newTask) {
        collection.updateOne(
            {userId: userID},
            {$rename:
                    { [task]: newTask}
            }
        )
    }

    function deleteMul (userID, taskArr) {
        taskArr.forEach(function (ind) {
            collection.updateOne(
                {userId: userID},
                {$unset:
                        {
                            [ind]: ""
                        }
                }
            )
        })
    }
});

/*



function connectDb() {
   connection.connect();
    /!*
    *
    *
    * To introduce modularity we seperate the quries to the database
    * from the actual connection to the database by introducing the operations.js file
    *
    * *!/
    /!*connection.query('SELECT * FROM TASK', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
    });*!/


    /!*
    *
    * display is called from the server.js since we need to send data to the client
    *
    * *!/
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
*/

module.exports = {
/*    connectDb,
    display,
    add,
    deleteEle,
    update,
    deleteMultiple,*/

    insertNewUser,
    insertTodo,
    retrieveAll,
    deleteElement,
    deleteMul,
    updateElement
};