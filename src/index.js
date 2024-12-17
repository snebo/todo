import { TodoCollection } from './assets/collections';
import './assets/styles.css';
import { Project, Task } from './assets/task';

const projectContainer = document.querySelector('.projectList');
const projectBox = document.querySelector('#projectName');
const pTitle = document.querySelector('#projectTitle');
const pDate = document.querySelector('#dateCreated');
const pNoTasks = document.querySelector('#taskNo');
const taskContainer = document.querySelector('#taskList');
const createTaskDiv = document.getElementById('create-task');

const todoCollection = localStorage.getItem('todoCollection') ? loadCollection() : new TodoCollection();

// Event listeners
document.querySelector('#addProject').addEventListener('click', handleAddProject);
document.addEventListener('DOMContentLoaded', () => {
    listProjects(todoCollection);
});

// Functions
function handleAddProject() {
    const projectName = projectBox.value.trim();
    if (!projectName) {
        alert('Project name cannot be empty!');
        return;
    }
    todoCollection.addProject(new Project(projectName));
    updateCollection();
    projectBox.value = '';
    listProjects(todoCollection);
}

function listProjects(collection) {
    projectContainer.innerHTML = '';
    collection.getAllProjects().forEach((project) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a class="project" href="#">${project.name}</a>
            <button class="delete-project" data-name="${project.name}">Delete</button>
        `;
        // li.querySelector('.project').addEventListener('click', () => {
        li.addEventListener('click', (e) => {
            const projects = projectContainer.querySelectorAll('li')
            projects.forEach(one => {
                one.classList.remove('active')
            })
            e.target.classList.add('active')
            todoCollection.setActiveProject(project);
            loadProjectDetails(project);
            loadTasks(project);
        });
        li.querySelector('.delete-project').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete the project "${project.name}"?`)) {
                todoCollection.removeProject(project);
                updateCollection();
                listProjects(collection);
            }
        });
        projectContainer.appendChild(li);
    });
}

function loadProjectDetails(project) {
    pTitle.textContent = project.name || 'Untitled';
    pDate.textContent = `Created on: ${project.createDate}` || 'Unknown Date';
    pNoTasks.textContent = `Number of tasks: ${project.tasks.length || 0}`;
}

function loadTasks(project) {
    taskContainer.innerHTML = '';
    project.getAllTasks().forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task">
                <div class="details">
                    <div class="priority ${task.priority}"></div>
                    <p>Title: ${task.name}</p>
                    <p>Description: ${task.description}</p>
                </div>
                <button class="delete-task" data-index="${index}">Delete</button>
            </div>
        `;

        li.querySelector('.task').addEventListener('click', (e) => {
            // Prevent triggering if delete button is clicked
            if (e.target.classList.contains('delete-task')) return;

            // Remove any existing edit forms
            const existingEditForm = taskContainer.querySelector('.edit-task-form');
            if (existingEditForm) {
                existingEditForm.remove();
            }

            // Create edit form for this specific task
            const editForm = createEditTaskForm(project, task, index);
            li.appendChild(editForm);
        });

        li.querySelector('.delete-task').addEventListener('click', () => {
            project.removeTask(index);
            updateCollection();
            loadTasks(project);
            loadProjectDetails(project);
        });
        taskContainer.appendChild(li);
    });
    renderTaskForm(project);
}


function renderTaskForm(project) {
    const li = document.createElement('li')
    li.innerHTML = `
        <form id="task-form">
            <label for="title">Title: </label>
            <input type="text" id="title" name="title" required>
            <br>
            <label for="description">Description: </label>
            <textarea id="description" name="description" rows="4"></textarea>
            <br>
            <label>Priority: </label>
            <div>
                <label>
                    <input type="radio" name="priority" value="Low" checked> Low
                </label>
                <label>
                    <input type="radio" name="priority" value="Medium"> Medium
                </label>
                <label>
                    <input type="radio" name="priority" value="High"> High
                </label>
            </div>
            <button type="submit">Add Task</button>
        </form>
    `;
    taskContainer.appendChild(li)

    document.getElementById('task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const priority = document.querySelector('input[name="priority"]:checked').value;

        if (!title) {
            alert('Task title is required!');
            return;
        }

        project.addTask(new Task(title, description, priority));
        updateCollection();
        loadTasks(project);
        loadProjectDetails(project);
    });
}

function createEditTaskForm(project, task, index) {
    const editForm = document.createElement('form');
    editForm.classList.add('edit-task-form');
    editForm.innerHTML = `
        <label for="edit-title">Title: </label>
        <input type="text" id="edit-title" name="title" value="${task.name}" required>
        <br>
        <label for="edit-description">Description: </label>
        <textarea id="edit-description" name="description" rows="4">${task.description}</textarea>
        <br>
        <label>Priority: </label>
        <div>
            <label>
                <input type="radio" name="priority" value="Low" ${task.priority === 'Low' ? 'checked' : ''}> Low
            </label>
            <label>
                <input type="radio" name="priority" value="Medium" ${task.priority === 'Medium' ? 'checked' : ''}> Medium
            </label>
            <label>
                <input type="radio" name="priority" value="High" ${task.priority === 'High' ? 'checked' : ''}> High
            </label>
        </div>
        <br>
        <label for="edit-due-date">Due Date: </label>
        <input type="date" id="edit-due-date" name="due_date" value="${task.due_date}">
        <button type="submit">Save Changes</button>
        <button type="button" class="cancel-edit">Cancel</button>
    `;

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = editForm.querySelector('#edit-title').value.trim();
        const description = editForm.querySelector('#edit-description').value.trim();
        const priority = editForm.querySelector('input[name="priority"]:checked').value;
        const dueDate = editForm.querySelector('#edit-due-date').value;

        if (!title) {
            alert('Task title is required!');
            return;
        }

        // Update the existing task
        // project.tasks[index] = new Task(title, description, priority);
        task.updateTask(title, description, priority, dueDate)
        updateCollection();
        loadTasks(project);
        loadProjectDetails(project);
    });

    // Cancel edit button
    editForm.querySelector('.cancel-edit').addEventListener('click', () => {
        editForm.remove();
    });

    return editForm;
}

function updateCollection() {
    localStorage.setItem('todoCollection', JSON.stringify(todoCollection));
}

function loadCollection() {
    const serializedData = localStorage.getItem('todoCollection');
    try {
        const parsedData = JSON.parse(serializedData);
        return TodoCollection.fromJSON(parsedData);
    } catch (error) {
        console.error('Failed to load collection from storage:', error);
        return new TodoCollection();
    }
}
