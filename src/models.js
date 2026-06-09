import {todoValidate} from './validators.js';

export class Todo {    
    #dateCreated = new Date();
    #title;
    #priority;
    #desc;
    #due;

    constructor(title, priority = 'moderate', desc = '', due = null){
        this.#title = todoValidate.title(title);
        this.#priority = todoValidate.priority(priority);
        this.#desc = todoValidate.desc(desc);
        this.#due = todoValidate.due(due, this.#dateCreated);
    }

    get dateCreated() {
        return this.#dateCreated;
    }

    get title() {
        return this.#title;
    }

    get priority() {
        return this.#priority;
    }

    get desc() {
        return this.#desc;
    }

    get due() {
        if(this.#due === null) return null;
        return this.#due;
    }

    set title(newTitle) {
        this.#title = todoValidate.title(newTitle);
    }

    set priority(newPriority) {
        this.#priority = todoValidate.priority(newPriority);
    }

    set desc(newText) {
        this.#desc = todoValidate.desc(newText);
    }

    set due(newDueDate) {
        this.#due = todoValidate.due(newDueDate, this.#dateCreated);
    }
}
