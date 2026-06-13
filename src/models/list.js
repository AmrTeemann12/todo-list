import { validateTitle } from "../validators.js";
import { Todo } from "./todo.js";

export class TaskList {
    #todos = [];
    #title;
    #id = crypto.randomUUID();

    constructor(title, category) {
        this.#title = validateTitle(title);
        this.category = category;
    }

    get title() {
        return this.#title;
    }

    get id() {
        return this.#id;
    }

    set title(newTitle) {
        this.#title = validateTitle(newTitle);
    }

    addTodo(request) {
        const todo = new Todo(
            request.title,
            request.priority,
            request.desc,
            request.startDate,
            request.due
        );
        this.#todos.push(todo);
    }

    readTodos() {
        return this.#todos.map(item => ({
            dateCreated: item.dateCreated,
            id: item.id,
            title: item.title,
            priority: item.priority,
            startDate: item.startDate,
            desc: item.desc,
            due: item.due,
        }))
    }

    updateTodo(id, changes) {
        const acceptedKeys = ['title', 'priority', 'desc', 'due', 'startDate'];
        const todo = this.#todos.find(item => item.id === id);
        
        if(!todo) throw new Error('invalid todo id');

        for(let key in changes) {
            if(!acceptedKeys.includes(key)) throw new Error ('invalid update request');

            todo[key] = changes[key];
        }
    }

    removeTodo(id) {
        const todoIndex = this.#todos.findIndex(item => item.id === id);
        if(todoIndex === -1) {
            throw new Error('invalid todo id')
        } else {
            this.#todos.splice(todoIndex, 1);
            return true;
        }
    }
}
