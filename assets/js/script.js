// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $(`
        <div class="task-card" data-id="${task.id}">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Due: ${task.dueDate}</p>
        </div>
    `);

    const deleteBtn = $(`
        <button class="delete-btn">Delete</button>
    `)

    deleteBtn.on("click", handleDeleteTask)

    card.append(deleteBtn)


    card.draggable({
        revert: true,
        zIndex:100
    });
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();
    console.log(taskList) 
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        if(task.status == "in-progress"){
            $('#in-progress-cards').append(taskCard);
        }
        else if(task.status == "done"){
            $('#done-cards').append(taskCard)
        }
        else{
            $('#todo-cards').append(taskCard);
        }
    });

    // Make lanes droppable
    $('.lane').droppable({
        accept: '.task-card',
        drop: handleDrop
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    
    const title = $('#task-title').val();
    const description = $('#task-description').val();
    const dueDate = $('#task-due-date').val();
    
    const newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
    
    renderTaskList();
    
    $('#task-title').val('');
    $('#task-description').val('');
    $('#task-due-date').val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event.target).parent().data("id")
    console.log(taskId)
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id');
    const statusLane = $(event.target).attr("id")
    console.log(statusLane)
    taskList.forEach(task => {
        console.log(taskId)
        console.log(task)
       if (taskId==task.id){
        task.status=statusLane
       }
    });
console.log(taskList)
localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList(); 
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    
    $('#add-task-form').on('click', handleAddTask);
    $('#task-container').on('click', '.delete-btn', handleDeleteTask);
    
    $('#task-due-date').datepicker();
});
