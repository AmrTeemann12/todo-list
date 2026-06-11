import {Todo} from './models/todo.js';
import {TaskList} from './models/list.js';
import { 
    createList,
    addTodoToList,
    readLists,
    updateListTitle,
    updateListTodo,
    removeList,
    removeListTodo,
} from './listsManager.js';

const t1 = new Todo('clean', 'low', '', new Date('2026-06-11T22:00'))
const list = new TaskList('general')
createList('movies', [
    {title: 'elephant man', priority: 'high', desc: 'good tragic movie form the 1970s I think', due: new Date('2026-7-1')},
    {title: 'v for vendeta', priority: 'low' }
])
