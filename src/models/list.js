import { validateTitle } from "../validators.js";
import { Todo } from "./todo.js";

export class TaskList {
    #todos = [];
    #title;

    constructor(title) {
        this.#title = validateTitle(title);
    }

    get title() {
        return this.#title;
    }

    set title(newTitle) {
        this.#title = validateTitle(newTitle);
    }

    addTodo(title, priority, desc, due) {
        this.#todos.forEach(item => {
            if(item.title === title) {
                throw new Error('this todo already exists in the current list')
            }
        })
        const todo = new Todo(title, priority, desc, due);
        
        this.#todos.push(todo)
    }

    readTodos() {
        return this.#todos.map(item => ({
            dateCreated: item.dateCreated,
            id: item.id,
            title: item.title,
            priority: item.priority,
            desc: item.desc,
            due: item.due,
        }))
    }

    updateTodo(id, changes) {
        const todo = this.#todos.find(item => item.id === id);
        if(!todo) throw new Error('this todo isn\'t found');
        
        for(let key in changes) {
            todo[key] = changes[key];
        }
    }

    removeTodo(id) {
        const todoIndex = this.#todos.findIndex(item => item.id === id);
        if(todoIndex === -1) {
            throw new Error('this todo doesn\'t exist in the current list')
        } else {
            this.#todos.splice(todoIndex, 1);
            return true;
        }
    }
}
