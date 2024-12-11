function addTask() {
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const dueTimeInput = document.getElementById('due-time-input');
    const taskList = document.getElementById('task-list');

    if (taskInput.value.trim() === '') {
        alert('Please enter a task');
        return;
    }

    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    const taskText = document.createElement('span');
    taskText.textContent = `${taskInput.value} - ${dueDateInput.value} ${dueTimeInput.value}`;

    // Edit task text on click
    taskText.onclick = function() {
        const newTaskText = prompt('Edit task:', taskText.textContent.split(' - ')[0]);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            taskText.textContent = `${newTaskText} - ${dueDateInput.value} ${dueTimeInput.value}`;
            saveTasks(); // Save tasks after editing
        }
    };

    // Priority selection
        // Change priorities to descending order
        const prioritySelect = document.createElement('select');
        const priorities = ['High', 'Medium', 'Low']; // Updated order
        priorities.forEach(priority => {
            const option = document.createElement('option');
            option.value = priority;
            option.textContent = priority;
            prioritySelect.appendChild(option);
        });
        taskItem.appendChild(prioritySelect);

    // Completion checkbox
    const completeCheckbox = document.createElement('input');
    completeCheckbox.type = 'checkbox';
    completeCheckbox.onclick = function() {
        taskText.style.textDecoration = completeCheckbox.checked ? 'line-through' : 'none';
    };
    taskItem.appendChild(completeCheckbox);

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        taskList.removeChild(taskItem);
        saveTasks(); // Save tasks after deletion
    };

    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);

    taskInput.value = '';
    dueDateInput.value = '';
    dueTimeInput.value = '';
    saveTasks(); // Save tasks after adding
}

// Save tasks to localStorage
function saveTasks() {
    const taskList = document.getElementById('task-list');
    const tasks = [];
    Array.from(taskList.children).forEach(taskItem => {
        const taskText = taskItem.querySelector('span').textContent;
        const [task, due] = taskText.split(' - ');
        const [dueDate, dueTime] = due.split(' ');
        const priority = taskItem.querySelector('select').value;
        const completed = taskItem.querySelector('input[type="checkbox"]').checked;
        tasks.push({ task, dueDate, dueTime, priority, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear existing tasks

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        const taskText = document.createElement('span');
        taskText.textContent = `${task.task} - ${task.dueDate} ${task.dueTime}`;

        // Edit task text on click
        taskText.onclick = function() {
            const newTaskText = prompt('Edit task:', taskText.textContent.split(' - ')[0]);
            if (newTaskText !== null && newTaskText.trim() !== '') {
                taskText.textContent = `${newTaskText} - ${task.dueDate} ${task.dueTime}`;
                saveTasks(); // Save tasks after editing
            }
        };

        // Priority selection
        const prioritySelect = document.createElement('select');
        const priorities = ['High', 'Medium', 'Low']; // Updated order
        priorities.forEach(priority => {
            const option = document.createElement('option');
            option.value = priority;
            option.textContent = priority;
            if (priority === task.priority) {
                option.selected = true;
            }
            prioritySelect.appendChild(option);
        });
        taskItem.appendChild(prioritySelect);
        // Completion checkbox
        const completeCheckbox = document.createElement('input');
        completeCheckbox.type = 'checkbox';
        completeCheckbox.checked = task.completed;
        completeCheckbox.onclick = function() {
            taskText.style.textDecoration = completeCheckbox.checked ? 'line-through' : 'none';
        };
        taskItem.appendChild(completeCheckbox);

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            taskList.removeChild(taskItem);
            saveTasks(); // Save tasks after deletion
        };

        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        // Set the text decoration based on completion status
        taskText.style.textDecoration = task.completed ? 'line-through' : 'none';
    });
}

// Load tasks when the page is loaded
window.onload = loadTasks;

// Event listeners for sorting and filtering
document.getElementById('sort-button').onclick = sortTasks;
document.getElementById('filter-completed').onclick = function() {
    filterTasks(true); // Show only completed tasks
};
document.getElementById('filter-incomplete').onclick = function() {
    filterTasks(false); // Show only incomplete tasks
};

// Sorting function
function sortTasks() {
    const taskList = document.getElementById('task-list');
    const tasks = Array.from(taskList.children);
    const priorities = ['High', 'Medium', 'Low']; // Updated order for sorting

    console.log('Tasks before sorting:', tasks); // Debugging line

    tasks.sort((a, b) => {
        const priorityA = a.querySelector('select').value;
        const priorityB = b.querySelector('select').value;
        return priorities.indexOf(priorityA) - priorities.indexOf(priorityB); // Sort from High to Low
    });

    taskList.innerHTML = ''; // Clear existing tasks
    tasks.forEach(task => taskList.appendChild(task)); // Append sorted tasks

    console.log('Tasks after sorting:', tasks); // Debugging line
}

// Add the filterTasks function
function filterTasks(showCompleted) {
    const taskList = document.getElementById('task-list');
    const tasks = Array.from(taskList.children);

    tasks.forEach(task => {
        const completeCheckbox = task.querySelector('input[type="checkbox"]');
        if (completeCheckbox.checked === showCompleted) {
            task.style.display = 'block'; // Show task
        } else {
            task.style.display = 'none'; // Hide task
        }
    });
}
