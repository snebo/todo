const main_content = document.querySelector('.content')
export const Template = {
    default: () => {
        main_content.innerHtml = ''
        main_content.innerHTml = `
            <input type="text" id="projectName" />
            <button id="addProject">Add Project</button>
            <ul class="projectList"></ul>
        `
    },
}