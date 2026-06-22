import { addDays, addHours, addWeeks, isAfter, isBefore, startOfToday, startOfTomorrow } from 'date-fns';
import { readAllLists } from './listsManager.js';
import { categoryAdd, categoryNames, categoryDelete } from './models/category.js';

//sort array of todos by date
function sortAsc(todos) {
    todos.sort((a, b) => a.startDate - b.startDate);
}

//return object with keys/value as categories names/array with its lists
export function getListCategories() {
    const categoriesList = {};
    categoryNames().forEach(cat => categoriesList[cat] = []);
    
    readAllLists().forEach(list => {
        categoriesList[list.category].push(list)
    })
    
    return categoriesList;
}

//take array of lists as argument
//return an object with a time-base sorted arrays of todos
export function allTodosTimeArrange() {
    const past = [];
    const today = [];
    const tomorrow = [];
    const thisWeek = [];
    const later = [];
    const all = [];
    
    const todayDate = startOfToday();
    const tomorrowDate = startOfTomorrow();
    const afterTomorrow = addDays(startOfTomorrow(), 1);
    const nextWeek = addWeeks(startOfToday(), 1);

    const lists = readAllLists();

    lists.forEach(list => list.todos.forEach(todo => {
        todo.list = list.title;
        todo.listId = list.id;
        if(!todo.completed) {
            todo.dueStat = checkDue(todo)
        }
            
        all.push(todo)
    }))
    sortAsc(all);

    all.forEach(todo => {
        const date = todo.startDate;
            
        if(isBefore(date, todayDate)) {
            past.push(todo);
        } else if(isBefore(date, tomorrowDate)) {
            today.push(todo);
        } else if(isBefore(date, afterTomorrow)) {
            tomorrow.push(todo);
        } else if(isBefore(date, nextWeek)) {
            thisWeek.push(todo);
        } else {
            later.push(todo);
        }
    });

    return {
        past,
        today,
        tomorrow,
        thisWeek,
        later,
        all,
    };
}

//take a taskList as argument
//return a time-base sorted array of todos
export function listTodosTimeArrange(list) {
    sortAsc(list.todos)
    return list.todos;
}

//take array of todos as arguments
//return due status relative to now
export function checkDue(todo) {
    const now = new Date();
    const oneHourLater = addHours(new Date(), 1);
    const dueDate = todo.due;
    const startDate = todo.startDate;
    if(dueDate) {
        if(isBefore(dueDate, now)) {
            return 'past-due';
        } else if(isBefore(dueDate, oneHourLater) && isBefore(startDate, now)) {
            return 'within-hour';
        } else {
            return 'before-due';
        }
    } else {
        return false;
    }
}

export function getListDataByListId(listId) {
    const allListsData = readAllLists();
    const list = allListsData.find(list => list.id === listId);

    if(!list) throw new Error('invalid list id');
    return list;
}

export function getTodoDataById(todoId) {
    const allTodo = allTodosTimeArrange().all;
    const todo = allTodo.find(todo => todo.id === todoId);
    if(!todo) throw new Error('invalid todo id');
    
    return todo;
}