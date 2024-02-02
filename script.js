const taskInput = document.querySelector(".task-input input")
const filters = document.querySelectorAll(".filters span")
const clearAll = document.querySelector(".clear-btn")
let todos = JSON.parse(localStorage.getItem("todo-list")) // Getting localstorage to-do list
let taskBox = document.querySelector(".task-box")
let editId
let isEditedTask = false

function showTodo(filter)
{
    let li = ""
    if(todos)
    {
        todos.forEach((todo, id) => {
            let isCompleted = todo.status == "completed" ? "checked" : ""
            if(filter == todo.status || filter == "all")
            {
                li += `<li class="task">
                <label for="${id}">
                    <input onclick = "updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                    <p class = "${isCompleted}">${todo.name}</p>
                </label>
                <div class="settings">
                    <i onclick = "showMenu(this)" class="fa-solid fa-ellipsis"></i>
                    <ul class="task-menu">
                        <li onclick = "editTask(${id},'${todo.name}')"><i class="fa-solid fa-pen"></i>Edit</li>
                        <li onclick = "deleteTask(${id})"><i class="fa-solid fa-trash"></i>Delete</li>
                    </ul>
                </div>
                </li>`
            }
        })
    }
    taskBox.innerHTML = li || `<span> You don't have any task here </span`
}

showTodo("all")

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active")
        btn.classList.add("active")
        showTodo(btn.id)
    })
})


clearAll.addEventListener("click", ()=>{
    todos.splice(0,todos.length)
    localStorage.setItem("todo-list", JSON.stringify(todos))
    showTodo("all")
})


function updateStatus(selectedTask)
{
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked)
    {
        taskName.classList.add("checked")
        todos[selectedTask.id].status = "completed" // updating the status to completed
    }
    else
    {
        taskName.classList.remove("checked")
        todos[selectedTask.id].status = "pending" // updating the status to pending
    }
    localStorage.setItem("todo-list",JSON.stringify(todos))
}


function showMenu(selectedTask)
{
    let taskMenu = selectedTask.parentElement.lastElementChild
    taskMenu.classList.add("show")
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask)
        {
            taskMenu.classList.remove("show")
        }
    })
}



function editTask(taskId, taskName)
{
    editId = taskId
    taskInput.value = taskName
    isEditedTask = true
}


function deleteTask(deleteId)
{
    todos.splice(deleteId,1)
    localStorage.setItem("todo-list", JSON.stringify(todos))
    showTodo("all")
}


taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim()
    if(e.key == "Enter" && userTask)
    {
        if(!isEditedTask)
        {
            if(!todos) // if todos does'nt exist pass an empty array to todos
            {
                todos = [];
            }
            let taskInfo = {name: userTask, status: "pending"}
            todos.push(taskInfo)
        }
        else
        {
            isEditedTask = false
            todos[editId].name = userTask
        }
        taskInput.value = ""
        localStorage.setItem("todo-list",JSON.stringify(todos))
        showTodo("all")
    }
})