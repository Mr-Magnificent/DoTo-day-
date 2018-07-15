var todoList = [];
var delMul = [];
let result = $('#list');
let inp = $('#inp');
// let ind = 0;
$(document).ready(function(){


    // let btn = $('#btn');
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
        "id": 5,
        "done": false
    };

    inp.val('');

    $.ajax({
        url: '/add',
        method: 'post',
        data: {todo: test},

        success: function(data) {
            test.id = data;
            todoList.push(test);
            localStorage.setItem('todo', JSON.stringify(todoList));
            result.append(`<li>
                              <input type="checkbox" onclick="selMultiple(this)">
                              <span>${test.task}</span>
                              <button class="updDel" onclick="deleteKey(this)"><img src="baseline-delete-24px.svg" ></button>
                              <button class="updDel" onclick="updateKey(this)"><img src="baseline-edit-24px.svg" ></button>
                              </li>`
            )
        }
    });
}


function render(data) {
    data.forEach(function(i){
        result.append(`<li>
                              <input type="checkbox" onclick="selMultiple(this)">
                              <span>${i.task}</span>
                              <button class="updDel" onclick="deleteKey(this)"><img src="baseline-delete-24px.svg" ></button>
                              <button class="updDel" onclick="updateKey(this)"><img src="baseline-edit-24px.svg" ></button>
                              </li>`)
    })
}


/*
*
*
* Used to <img src="baseline-delete-24px.svg" > element
*
* */




function deleteKey(element) {
    let index = $(element).parent().index();
    let ind = todoList[index].id;

    $.ajax({
        url: '/delete',
        method: 'post',
        data: {id: ind},
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
    let ind = todoList[index].id;
    let newVal = prompt('Enter New Value');
    $.ajax({
        url: '/update',
        method: 'post',
        data: {val: newVal, index: ind},
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
    let idArr = [];
    for (let i = 0; i < delMul.length; i++) {
        idArr.push(todoList[delMul[i]].id);
    }
    console.log(idArr);
    $.ajax ({
        url: '/deleteMultiple',
        method: 'POST',
        data: {id: idArr},
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


