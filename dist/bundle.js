(()=>{"use strict";var __webpack_modules__={948:()=>{eval('\n;// CONCATENATED MODULE: ./src/components/base-component.ts\nclass Component {\n    constructor(templateId, hostElementId, insertAtStart, newElementId) {\n        this.templateElement = document.getElementById(templateId);\n        this.hostElement = document.getElementById(hostElementId);\n        const importedNode = document.importNode(this.templateElement.content, true);\n        this.element = importedNode.firstElementChild;\n        if (newElementId) {\n            this.element.id = newElementId;\n        }\n        this.attach(insertAtStart);\n    }\n    attach(insertAtBeginning) {\n        this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);\n    }\n}\n\n;// CONCATENATED MODULE: ./src/util/validation.ts\nfunction validate(validatableInput) {\n    let isValid = true;\n    if (validatableInput.required) {\n        isValid = isValid && validatableInput.value.toString().trim().length !== 0;\n    }\n    if (validatableInput.minLength != null && typeof validatableInput.value === "string") {\n        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;\n    }\n    if (validatableInput.maxLength != null && typeof validatableInput.value === "string") {\n        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;\n    }\n    if (validatableInput.min != null && typeof validatableInput.value === "number") {\n        isValid = isValid && validatableInput.value >= validatableInput.min;\n    }\n    if (validatableInput.max != null && typeof validatableInput.value === "number") {\n        isValid = isValid && validatableInput.value <= validatableInput.max;\n    }\n    return isValid;\n}\n\n;// CONCATENATED MODULE: ./src/decorators/autobind.ts\nfunction AutoBind(_, _2, descriptor) {\n    const originalMethod = descriptor.value;\n    const adjDescriptor = {\n        configurable: true,\n        get() {\n            const boundFn = originalMethod.bind(this);\n            return boundFn;\n        },\n    };\n    return adjDescriptor;\n}\n\n;// CONCATENATED MODULE: ./src/models/project.ts\nvar ProjectStatus;\n(function (ProjectStatus) {\n    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";\n    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";\n})(ProjectStatus || (ProjectStatus = {}));\nclass Project {\n    constructor(id, title, description, manday, status) {\n        this.id = id;\n        this.title = title;\n        this.description = description;\n        this.manday = manday;\n        this.status = status;\n    }\n}\n\n;// CONCATENATED MODULE: ./src/state/project-state.ts\n\nclass State {\n    constructor() {\n        this.listeners = [];\n    }\n    addListener(listenerFn) {\n        this.listeners.push(listenerFn);\n    }\n}\nclass ProjectState extends State {\n    constructor() {\n        super();\n        this.projects = [];\n    }\n    static getInstance() {\n        if (this.instance) {\n            return this.instance;\n        }\n        this.instance = new ProjectState();\n        return this.instance;\n    }\n    addProject(title, description, manday) {\n        const newProject = new Project(Math.random().toString(), title, description, manday, ProjectStatus.Active);\n        this.projects.push(newProject);\n        this.updateListeners();\n    }\n    moveProject(projectId, newStatus) {\n        const project = this.projects.find((prj) => prj.id === projectId);\n        if (project && project.status !== newStatus) {\n            project.status = newStatus;\n            this.updateListeners();\n        }\n    }\n    updateListeners() {\n        for (const listenerFn of this.listeners) {\n            listenerFn(this.projects.slice());\n        }\n    }\n}\nconst projectState = ProjectState.getInstance();\n\n;// CONCATENATED MODULE: ./src/components/project-input.ts\nvar __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\n\n\n\n\nclass ProjectInput extends Component {\n    constructor() {\n        super("project-input", "app", true, "user-input");\n        this.titleInputElement = this.element.querySelector("#title");\n        this.descriptionInputElement = this.element.querySelector("#description");\n        this.mandayInputElement = this.element.querySelector("#manday");\n        this.configure();\n    }\n    configure() {\n        this.element.addEventListener("submit", this.submitHandler);\n    }\n    renderContent() { }\n    gatherUserInput() {\n        const enteredTitle = this.titleInputElement.value;\n        const enteredDescription = this.descriptionInputElement.value;\n        const enteredManday = this.mandayInputElement.value;\n        const titleValidatable = {\n            value: enteredTitle,\n            required: true,\n        };\n        const descriptionValidatable = {\n            value: enteredDescription,\n            required: true,\n            minLength: 5,\n        };\n        const mandayValidatable = {\n            value: +enteredManday,\n            required: true,\n            min: 1,\n            max: 1000,\n        };\n        if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(mandayValidatable)) {\n            alert("入力値が正しくありません。再度お試しください。");\n            return;\n        }\n        else {\n            return [enteredTitle, enteredDescription, +enteredManday];\n        }\n    }\n    clearInputs() {\n        this.titleInputElement.value = "";\n        this.descriptionInputElement.value = "";\n        this.mandayInputElement.value = "";\n    }\n    submitHandler(e) {\n        e.preventDefault();\n        const userInput = this.gatherUserInput();\n        if (Array.isArray(userInput)) {\n            const [title, desc, manday] = userInput;\n            projectState.addProject(title, desc, manday);\n            this.clearInputs();\n        }\n    }\n}\n__decorate([\n    AutoBind\n], ProjectInput.prototype, "submitHandler", null);\n\n;// CONCATENATED MODULE: ./src/components/project-item.ts\nvar project_item_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\n\n\nclass ProjectItem extends Component {\n    get manday() {\n        if (this.project.manday < 20) {\n            return this.project.manday.toString() + "人日";\n        }\n        else {\n            return (this.project.manday / 20).toString() + "人月";\n        }\n    }\n    constructor(hostId, project) {\n        super("single-project", hostId, false, project.id);\n        this.project = project;\n        this.configure();\n        this.renderContent();\n    }\n    dragStartHandler(event) {\n        event.dataTransfer.setData("text/plain", this.project.id);\n        event.dataTransfer.effectAllowed = "move";\n    }\n    dragEndHandler(_) {\n        console.log("Drag終了");\n    }\n    configure() {\n        this.element.addEventListener("dragstart", this.dragStartHandler);\n        this.element.addEventListener("dragend", this.dragEndHandler);\n    }\n    renderContent() {\n        this.element.querySelector("h2").textContent = this.project.title;\n        this.element.querySelector("h3").textContent = this.manday;\n        this.element.querySelector("p").textContent = this.project.description;\n    }\n}\nproject_item_decorate([\n    AutoBind\n], ProjectItem.prototype, "dragStartHandler", null);\n\n;// CONCATENATED MODULE: ./src/components/project-list.ts\nvar project_list_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\n\n\n\n\n\nclass ProjectList extends Component {\n    constructor(type) {\n        super("project-list", "app", false, `${type}-projects`);\n        this.type = type;\n        this.assignedProjects = [];\n        this.configure();\n        this.renderContent();\n    }\n    dragOverHandler(event) {\n        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {\n            event.preventDefault();\n            const listEl = this.element.querySelector("ul");\n            listEl.classList.add("droppable");\n        }\n    }\n    dropHandler(event) {\n        const prjId = event.dataTransfer.getData("text/plain");\n        projectState.moveProject(prjId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);\n    }\n    dragLeaveHandler(_) {\n        const listEl = this.element.querySelector("ul");\n        listEl.classList.remove("droppable");\n    }\n    configure() {\n        this.element.addEventListener("dragover", this.dragOverHandler);\n        this.element.addEventListener("drop", this.dropHandler);\n        this.element.addEventListener("dragleave", this.dragLeaveHandler);\n        projectState.addListener((projects) => {\n            const relevantProjects = projects.filter((prj) => {\n                if (this.type === "active") {\n                    return prj.status === ProjectStatus.Active;\n                }\n                return prj.status === ProjectStatus.Finished;\n            });\n            this.assignedProjects = relevantProjects;\n            this.renderProjects();\n        });\n    }\n    renderContent() {\n        const listId = `${this.type}-projects-list`;\n        this.element.querySelector("ul").id = listId;\n        this.element.querySelector("h2").textContent = this.type === "active" ? "実行中プロジェクト" : "完了プロジェクト";\n    }\n    renderProjects() {\n        const listEl = document.getElementById(`${this.type}-projects-list`);\n        listEl.innerHTML = "";\n        for (const prjItem of this.assignedProjects) {\n            new ProjectItem(listEl.id, prjItem);\n        }\n    }\n}\nproject_list_decorate([\n    AutoBind\n], ProjectList.prototype, "dragOverHandler", null);\nproject_list_decorate([\n    AutoBind\n], ProjectList.prototype, "dropHandler", null);\nproject_list_decorate([\n    AutoBind\n], ProjectList.prototype, "dragLeaveHandler", null);\n\n;// CONCATENATED MODULE: ./src/app.ts\n\n\nnew ProjectInput();\nnew ProjectList("active");\nnew ProjectList("finished");\n\n\n//# sourceURL=webpack://understanding-typescript/./src/app.ts_+_8_modules?')}},__webpack_exports__={};__webpack_modules__[948]()})();