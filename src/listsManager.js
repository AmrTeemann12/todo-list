import { TaskList } from "./models/list.js";

const lists = [];

export function createList(title, todoRequests) {
    lists.forEach(list => {if(list.title === title) {
            throw new Error('list title must be unique');
        }
    });

    const list = new TaskList(title);
    if(todoRequests) {
        todoRequests.forEach(todoRequest => {
            list.addTodo(todoRequest)
        });
    }
    lists.push(list);
}

export function addTodoToList(listId, todoRequest) {
    const list = lists.find(list => list.id === listId);
    if(!list) throw new Error('invalid list id');

    list.addTodo(todoRequest);
}

export function readLists() {
    return lists.map(list => ({
        id: list.id,
        title: list.title,
        todos: list.readTodos()
    }))
}

export function updateListTitle(listId, newTitle) {
    const list = lists.find(list => list.id === listId);
    
    if(!list) throw new Error('invalid list id');

    if(newTitle) {
        lists.forEach(list => {if(list.title === newTitle) {
                throw new Error('this list title already exist');
            }
        });
        list.title = newTitle;
    }
}

export function updateListTodo(listId, todoId, changes) {
    const list = lists.find(list => list.id === listId);

    if(!list) throw new Error ('invalid list id');

    list.updateTodo(todoId, changes);
}

export function removeList(listId) {
    const listIndex = lists.findIndex(list => list.id === listId);

    if(listIndex === -1) {
        throw new Error('invalid list id');
    } else {
        lists.splice(listIndex, 1);
        return true;
    }
}

export function removeListTodo(listId, todoId) {
    const list = lists.find(list => list.id === listId);
    if(!list) throw new Error('invalid list id');

    list.removeTodo(todoId);
}