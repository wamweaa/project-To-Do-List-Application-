
// Fetch random quote from Quotable API
function fetchRandomQuote() {
    fetch('https://api.quotable.io/random')
        .then(response => {
            // Check if response is successful
            if (!response.ok) {
                
                throw new Error('Network response was not ok');
            }
            // Parse response body as JSON
            return response.json();
        })
        .then(data => {
            // Display quote on the page
            displayQuote(data.content);
        })
        .catch(error => {
            // Handle errors
            console.error('Fetch error:', error);
        });
}

// Display quote on the page
function displayQuote(quote) {
    const quoteElement = document.getElementById('quote');
    quoteElement.textContent = quote;
}

// Function to add a new task
function addTask(taskText) {
    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',

        },
        body: JSON.stringify({ text: taskText, completed: false })
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response
            console.log('New task added:', data);
            renderTask(data.text, data.completed);
        })
        .catch(error => {
            console.error('Error adding task:', error);
        });
}

// input task on the page
function renderTask(taskText, completed) {
    const todoList = document.getElementById('todo-list');
    const taskItem = document.createElement('li');
    const text = document.createElement('span')
    text.textContent= taskText;

    const deleteButton = document.createElement('button');
     //const deleteButton = document.getElementById('deleteButton')
    deleteButton.innerHTML = 'delete';
    deleteButton.classList.add('delete-btn');//the classlist allows you to toggle,add or delete them without directly manipulating them
    deleteButton.addEventListener('click', function() {
        taskItem.remove();
        // Implement code to delete task from server if needed
        updateLocalStorage();
    });

    const completeButton = document.createElement('button');
    //const completeButton = document.getElementById('completeButton')
    completeButton.innerHTML = '✅︎';
    completeButton.classList.add('complete-btn');
    completeButton.addEventListener('click', function() {
        taskItem.classList.toggle('completed');
        // Implement code to update task completion status on server if needed
        updateLocalStorage();
    });

    if (completed) {
        taskItem.classList.add('completed');
    }

    taskItem.appendChild(text)
    taskItem.appendChild(deleteButton);
    taskItem.appendChild(completeButton);
    todoList.appendChild(taskItem);

    updateLocalStorage();
}

// Function to update tasks in localStorage
function updateLocalStorage() {
    const tasks = [];
    const todoList = document.getElementById('todo-list');
    todoList.querySelectorAll('li > span').forEach(function(taskItem) {
        tasks.push({
            text: taskItem.textContent,
            completed: taskItem.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
}

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(function(task) {
        renderTask(task.text, task.completed);
    });
}

// Example usage: Fetch random quote when the page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchRandomQuote();

    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            input.value = '';
        }
    });

    loadTasks();
});
