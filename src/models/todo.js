import {validateTitle, validateDesc, validatePriority, validateDue} from '../validators.js';

export class Todo {    
    #dateCreated = new Date();
    #id = crypto.randomUUID();
    #title;
    #priority;
    #desc;
    #due;

    constructor(title, priority = 'moderate', desc = '', due = null){
        this.#title = validateTitle(title);
        this.#priority = validatePriority(priority);
        this.#desc = validateDesc(desc);
        this.#due = validateDue(due, this.#dateCreated);
    }

    get dateCreated() {
        return new Date(this.#dateCreated);
    }

    get id() {
        return this.#id;
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
        return this.#due? new Date(this.#due): null;
    }

    set title(newTitle) {
        this.#title = validateTitle(newTitle);
    }

    set priority(newPriority) {
        this.#priority = validatePriority(newPriority);
    }

    set desc(newText) {
        this.#desc = validateDesc(newText);
    }

    set due(newDueDate) {
        this.#due = validateDue(newDueDate, this.#dateCreated);
    }
}
