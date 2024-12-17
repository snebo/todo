/**
 * TODO APP
 * todo's should be objects that we dynamically create
 * @title = title of the task [string]
 * @description = description of the task [string]
 * @dueDate = date the task due [date]
 * @priority = priority of the task [low, medium, high]
 * optional ------------
 * @notes = additional notes on each task [string]
 * @checklist = list of items to be completed [key: value pair]
 * 
 * Project1 --- task--- title, description, dueDate, priority
 *         --- task --- title,  description, ...
 * 
 * Project2 --- task --- title, descirption, ...
 */

export class Project {
    constructor(name) {
        this.name = name;
        this.createDate = new Date().toLocaleDateString()
        this.tasks = [] // store tasks
    }
    addTask(task) {
        this.tasks.push(task)
        return 'success'
    }

    removeTask(index) {
        // this.tasks.splice(this.tasks.indexOf(task), 1)
        this.tasks.splice(index, 1)
    }
    getAllTasks() {
        return this.tasks
    }
    toJSON() {
        return {
            name: this.name,
            tasks: this.tasks.map(task => task.toJSON())
        };
    }

    // Static method to recreate a project from a plain object
    static fromJSON(json) {
        const project = new Project(json.name);
        project.tasks = json.tasks.map(taskJson => Task.fromJSON(taskJson));
        return project;
    }

}

export class Task {
    constructor(title, description = '', priority = 'low', due_date = new Date().toLocaleDateString()) {
        this.name = title;
        this.description = description;
        this.due_date = due_date;
        this.priority = priority;
    }

    updateTask(newTitle, newDescription, newPriority, newDueDate) {
        this.name = newTitle;
        this.description = newDescription;
        this.priority = newPriority;
        this.due_date = newDueDate;
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            due_date: this.due_date,
            priority: this.priority
        };
    }

    static fromJSON(json) {
        return new Task(
            json.name,
            json.description,
            json.priority,
            json.due_date
        );
    }
}