let todoList;
let delMul = [];
let result = $('#list');
let inp = $('#inp');
// let userID;
// let ind = 0;
$(document).ready(function(){

    (function () {
        userID = Cookies.get('userID');
        if (!userID) {
            let res = prompt("Are you a new user (y/n)");
            if (res[0].toLowerCase() === 'y') {
                $.ajax({
                    url: '/newuser',
                    method: 'get',
                    success: function (data) {
                        $('#userid').text(`${data}`);
                        // userID = data;
                        Cookies.set('userID', `${data}`);
                    }
                })
            }
            else {
                console.log("not a new user");
                let userid;
                while (!userid) {
                    userid = prompt("Enter you UserID");
                }
                userid = parseInt(userid);

                if (typeof(userid) === 'number') {
                    console.log(userid);
                    Cookies.set('userID', userid.toString());
                    $('#userid').text(`${userid}`);
                }
            }
        }
    }());

    display();

    function display(){
        let data = JSON.parse(localStorage.getItem('todo')) || [];
        if(data.length) {
           render(data);
           todoList = data;
        }
        else {
            $.ajax({
                url: '/display',
                method: 'get',
                success: function(data) {
                    localStorage.setItem('todo', JSON.stringify(data));
                    render(data);
                    todoList = data;
                }
            })
        }
    }
});



function makeRequest() {

    let input = inp.val();
    let tick = $('#tick');
    tick.css('visibility', 'visible');

    setTimeout(function () {
        tick.css('visibility', 'hidden');
    }, 400);

    if (!input) {
        return null;
    }

    let test = {
        "task" : input,
        "done": false
    };

    inp.val('');

    $.ajax({
        url: '/add',
        method: 'post',
        data: {todo: test},

        success: function(data) {
            todoList.push(test);
            localStorage.setItem('todo', JSON.stringify(todoList));
            result.append(`<li>
                              <input type="checkbox" onclick="selMultiple(this)">
                              <span>${data}</span>
                              <button class="updDel" onclick="deleteKey(this)"><img src="baseline-delete-24px.svg" ></button>
                              <button class="updDel" onclick="updateKey(this)"><img src="baseline-edit-24px.svg" ></button>
                              </li>`
            )
        }
    });
}


function render(data) {
    data = JSON.parse(data);
    for(let prop in data) {
        if (prop === "user" || prop === "_id" || !Object.hasOwnProperty(prop)) {
            continue;
        }
        result.append(`<li>
                              <input type="checkbox" onclick="selMultiple(this)">
                              <span>${prop}</span>
                              <button class="updDel" onclick="deleteKey(this)"><img src="baseline-delete-24px.svg" ></button>
                              <button class="updDel" onclick="updateKey(this)"><img src="baseline-edit-24px.svg" ></button>
                              </li>`)
    }
}


/*
*
*
* Used to <img src="baseline-delete-24px.svg" > element
*
* */




function deleteKey(element) {
    let index = $(element).parent().index();
    let task = todoList[index].task;

    $.ajax({
        url: '/delete',
        method: 'post',
        data: {task: task},
        success: function() {
            $(element).parent().remove();
            todoList.splice(index, 1);
            localStorage.setItem('todo', JSON.stringify(todoList));
        }
    })

}



/*
*
*
* This is code for updation of an element of
* todo list
*
*
* */


function updateKey(element) {

    let parent = $(element).parent();
    let index = parent.index();
    let prevVal = todoList[index].task;
    let newVal = prompt('Enter New Value');
    $.ajax({
        url: '/update',
        method: 'post',
        data: {val: newVal, prevVal: prevVal},
        success: function (data) {
            parent.html(`<input type="checkbox" onclick="selMultiple(this)">
                         <span>${data}</span>
                         <button class="updDel" onclick="deleteKey(this)"><img src="baseline-delete-24px.svg"></button>
                         <button class="updDel" onclick="updateKey(this)"><img src="baseline-edit-24px.svg"></button>`);
            todoList[index].task = data;
            localStorage.setItem('todo', JSON.stringify(todoList));
        }
    })
}


function deleteMultiple() {
    let taskArr = [];
    for (let i = 0; i < delMul.length; i++) {
        taskArr.push(todoList[delMul[i]].task);
    }
    console.log(taskArr);
    $.ajax ({
        url: '/deleteMultiple',
        method: 'POST',
        data: {task: taskArr},
        success: function(data) {
            delMul.sort();
            delMul.reverse();
            delMul.forEach(function(ind) {
                $('#list').children().eq(ind).remove();
                todoList.splice(ind, 1);
            });
            localStorage.setItem('todo', JSON.stringify(todoList));
            delMul = [];
        }
    });
}

function selMultiple(element) {
    let index = $(element).parent().index();
    console.log('hello');
    if (!element.checked) {
        console.log('hello');
        for (let i = 0; i < delMul.length; i++) {
            if (delMul[i] === index) {
                delMul.splice(i, 1);
            }
        }
    }
    else {
        delMul.push(index);
    }
}

// Call the function at the top, display()

/*
* function display() {
*
*   Get Request at /display route
*   Loop that todoList and append on the page
* }
 *
* */