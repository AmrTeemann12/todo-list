import { 
    createList,
    addTodoToList,
    readAllLists,
    changeListTitle,
    changeListCategory,
    updateTodoInList,
    toggleTodoStat,
    removeList,
    removeListTodo,
} from './listsManager.js';
import {
    allTodosTimeArrange,
    checkDues,
    listTodosTimeArrange,
    sortListCategories,
} from './app.js';
import { categoryAdd, categoryNames } from './models/category.js';



createList('movies', 'entertainment', [
    {title: 'elephant man', priority: 'high', desc: 'good tragic movie form the 1970s I think', due: new Date('2026-7-1')},
    {title: 'v for vendetta', priority: 'low', startDate: new Date('2027-01-01') }
])

createList('somethings to do', 'general', [
    {title: 'something to do1', startDate: new Date('2026-06-14T21:50:00'), due: new Date('2026-06-14T21:55')},
    {title: 'something to do2', startDate: new Date('2026-06-14T22:00:00'), due: new Date('2026-06-15T00:00')},
    {title: 'something to do3', startDate: new Date('2026-06-15'), due: new Date('2026-06-16T00:00')},
    {title: 'something to do4', startDate: new Date('2026-06-14T10:20'), due: new Date('2026-06-16T00:00')},
    {title: 'something to do5', startDate: new Date('2026-7-12'), due: new Date('2026-08-12T10:00')},
])

