import { TaskList } from "./models/list.js";
import { Categories } from "./models/categories.js";

const lists = [];

function findListById(listId) {
    const list = lists.find(list => list.id === listId);
    if(!list) throw new Error('invalid list Id')
    
    return list;
}

export function createList(title, category = 'general', todoRequests) {
    if(lists.some(list => list.title === title && list.category === category)) {
        throw new Error('list title must be unique');
    }

    if(!Categories.names().includes(category.toLowerCase())) {
        throw new Error('invalid category name');
    }
    const list = new TaskList(title, category);
    
    if(todoRequests) {
        todoRequests.forEach(todoRequest => {
            list.addTodo(todoRequest)
        });
    }

    lists.push(list);
}

export function addTodoToList(listId, todoRequest) {
    list = findListById(listId)

    list.addTodo(todoRequest);
}

export function readAllLists() {
    return lists.map(list => ({
        id: list.id,
        title: list.title,
        category: list.category,
        todos: list.readTodos()
    }))
}

export function readCategoryLists(categoryName) {
    if(!Categories.names().includes(categoryName)) {
        throw new Error('no category found by this name')
    }
    const categoryLists = lists.filter(list => list.category === categoryName);
    return categoryLists.map(list => ({
        id: list.id,
        title: list.title,
        category: list.category,
        todos: list.readTodos()
    }))
}

export function changeListTitle(listId, newTitle) {
    const targetList = findListById(listId)

    if(lists.some(list => list.title === newTitle && list.category === targetList.category)) {
        throw new Error('this list title already exists in the current category');
    }

    targetList.title = newTitle;
}

export function changeListCategory(listId, categoryName) {
    const targetList = findListById(listId);
    const currentCategoryLists = readCategoryLists(categoryName);

    if(!Categories.names().includes(categoryName.toLowerCase())) {
        throw new Error('invalid category name');
    }

    if(currentCategoryLists.some(list => list.title === targetList.title)) {
        throw new Error('this category includes a list with the same title');
    }

    targetList.category = categoryName.toLowerCase();
}

export function updateTodoInList(listId, todoId, changes) {
    const list = findListById(listId);

    list.updateTodo(todoId, changes);
}

export function removeList(listId) {
    const listIndex = lists.findIndex(list => list.id === listId);

    if(listIndex === -1) {
        throw new Error('invalid list id');
    }

    lists.splice(listIndex, 1);
    return true;
}

export function removeListTodo(listId, todoId) {
    const list = findListById(listId);

    list.removeTodo(todoId);
}