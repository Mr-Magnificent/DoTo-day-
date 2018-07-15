
function todo(connection, data) {

    /*
    *
    * Since this is a async function we pass another function in the parameter
    * called data and call it to return the results
    *
    * */
    connection.query('SELECT * FROM todo', function (error, results, fields) {
        if (error) throw error;
        data(results);
    });
}



function add(connection, name, done, callba) {

    /**/

    let que = 'insert into todo (task, done) values (?, ?)';
    let insert = [name, done];
    connection.query(que, insert, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        callba (results);
    });
}

function deleteEle (connection, data, callback) {
/*
* */
    connection.query('delete from todo where id=?', data, function (error, results, fields) {
        if (error) throw error;
        callback(results);
    });
}

function update (connection, id, done, newval, callback) {

    let que = 'update todo set task=?, done=? where id=?';
    connection.query(que, [newval, done, id], function (error, results, fields) {
        if (error) throw error;
        callback(results);
    })
}

function deleteMultiple (connection, id, callback) {

    console.log(id);
    id.forEach(function (ind) {
        connection.query('delete from todo where id=?', ind, function (error, results, fields) {
            if (error) throw error;
        });
    })
}

module.exports = {
    todo,
    add,
    deleteEle,
    update,
    deleteMultiple
}