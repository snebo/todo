import { Project } from "./task";

export class TodoCollection {
    constructor() {
        this.projects = [new Project('default')]
        this.activeProject
    }
    addProject(project) {
        this.projects.push(project);
        return project
    }
    removeProject(project) {
        this.projects.splice(this.projects.indexOf(project), 1)
        return this.projects
    }
    getAllProjects() {
        return this.projects
    }
    addTaskToActiveProject(taskDetails) {

    }
    setActiveProject(project) {
        this.activeProject = project;
    }
    getActiveProject() {
        return this.activeProject
    }
    toJSON() {
        return {
            projects: this.projects.map(project => project.toJSON())
        };
    }

    // Static method to recreate the collection from a plain object
    static fromJSON(json) {
        const collection = new TodoCollection();
        collection.projects = json.projects.map(projectJson => Project.fromJSON(projectJson));
        return collection;
    }

}