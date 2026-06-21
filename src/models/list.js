import { validateTitle } from "../validators.js";
import { Todo } from "./todo.js";

export class TaskList {
    #todos = [];
    #title;
    #id = crypto.randomUUID();

    #findTodoById(id) {
        const todo = this.#todos.find(item => item.id === id);
        if(!todo) throw new Error('invalid todo id');

        return todo;
    }

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
        return todo;
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
            completed: item.completed,
        }))
    }

    updateTodo(id, changes) {
        const acceptedKeys = ['title', 'priority', 'desc', 'due', 'startDate'];
        const todo = this.#findTodoById(id);

        for(let key in changes) {
            if(!acceptedKeys.includes(key)) throw new Error ('invalid update request');
            todo[key] = changes[key];
        }
        return true;
    }

    toggleTodoStat(id) {
        const todo = this.#findTodoById(id);
        todo.toggleStat();
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

    listStat() {
        if(this.#todos.length < 1) return 'empty';
        
        if(this.#todos.every(todo => todo.completed === true)) return 'done';
        if(this.#todos.some(todo => todo.completed === true )) return 'doing';
        if(this.#todos.every(todo => todo.completed === false)) return 'to do';
    }
}
