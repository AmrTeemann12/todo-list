import {
    validateTitle,
    validateDesc,
    validatePriority,
    validateStartDate,
    validateDue,
} from '../validators.js';

export class Todo {    
    #dateCreated = new Date();
    #id = crypto.randomUUID();
    #title;
    #priority;
    #desc;
    #startDate;
    #due;
    #completed = false;

    constructor(title, priority = 'moderate', desc = '', startDate = this.#dateCreated, due = null){
        this.#title = validateTitle(title);
        this.#priority = validatePriority(priority);
        this.#desc = validateDesc(desc);
        this.#startDate = validateStartDate(startDate, this.#dateCreated, due);
        this.#due = validateDue(due, this.#startDate);
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

    get startDate() {
        return new Date(this.#startDate);
    }

    get due() {
        return this.#due? new Date(this.#due): null;
    }

    get completed() {
        return this.#completed;
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

    set startDate(newStartDate) {
        this.#startDate = validateStartDate(newStartDate, this.#dateCreated, this.#due);
    }

    set due(newDueDate) {
        this.#due = validateDue(newDueDate, this.#startDate);
    }

    toggleStat() {
        this.#completed = !this.#completed;
    }
}
