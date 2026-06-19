import { 
    createList,
    addTodoToList,
    readAllLists,
    changeListTitle,
    changeListCategory,
    updateTodoInList,
    toggleTodoStatInList,
    removeList,
    removeListTodo,
} from './listsManager.js';
import {
    allTodosTimeArrange,
    checkDues,
    listTodosTimeArrange,
    getListCategories,
    getListDataByListId,
    getTodoDataById,
} from './presenter.js';
import {
    createElms,
 } from './view.js';
 import './style.css';

createList('movies', 'entertainment', [
    {title: 'elephant man', priority: 'high', desc: 'good tragic movie form the 1970s I think', due: new Date('2026-7-1')},
    {title: 'v for vendetta', priority: 'low', startDate: new Date('2027-01-01') },
    {title: 'Blade Runner 2049', priority: 'moderate', startDate: new Date('2026-07-16') },
])

createList('somethings to do', 'general', [
    {title: 'something to do1', startDate: new Date('2026-06-20T23:50:00'), due: new Date('2026-06-21T22:55')},
    {title: 'something to do2', startDate: new Date('2026-06-20T23:00:00'), due: new Date('2026-06-21T00:00')},
    {title: 'something to do3', startDate: new Date('2026-06-20'), due: new Date('2026-06-21T00:00')},
    {title: 'something to do4', startDate: new Date('2026-06-20T10:20'), due: new Date('2026-06-21T00:00')},
    {title: 'something to do5', startDate: new Date('2026-7-13'), due: new Date('2026-08-12T10:00')},
])

createList('really long list name but I cannot think of a specific name yet', 'work', [
    {title: 'some todo'}
])

createList('some other things', 'general')

const list = readAllLists();
toggleTodoStatInList(list[0].id, list[0].todos[0].id)
//those above are some lists and todos and status change just for testing


const navbar = document.querySelector('nav');
const main = document.querySelector('main');
const addMainBtn = document.querySelector('#add-main');
const addMainTooltip = document.querySelector('#add-main-tooltip');
const addTasklistMain = document.querySelector('#add-tasklist-main');

function loadCategories() {
    const categoriesElem = createElms.navCategories(getListCategories())
    navbar.append(categoriesElem)
}

loadCategories()

navbar.addEventListener('click', (e) => {
    if(e.target.id === 'today') {
        const todayTodos = allTodosTimeArrange().today;
        const todayPageElem = createElms.todayPage(todayTodos)
        
        main.innerHTML = '';
        main.appendChild(todayPageElem);
    }

    if(e.target.id === 'all-to-dos') {
        const todosObj = allTodosTimeArrange();
        const allTodosPage = createElms.allTodoPage(todosObj);
        
        main.innerHTML = '';
        main.appendChild(allTodosPage);
    }

    if(e.target.id === 'all-lists') {
        const lists = readAllLists();
        const allListsPage = createElms.allListsPage(lists);
        
        main.innerHTML = '';
        main.appendChild(allListsPage);
    }

    if(e.target.dataset.action === 'open-category') {
        const categoryName = e.target.textContent.toLowerCase();
        const listCategory = getListCategories()[categoryName];
        const categoryPage = createElms.categoryPage(categoryName, listCategory);

        main.innerHTML = '';
        main.appendChild(categoryPage);
    }
})


document.addEventListener('click', (e) => {
    if(e.target.dataset.action === 'open-tasklist') {
        const listData = getListDataByListId(e.target.dataset.id);
        const taskListPage = createElms.taskListPage(listData);
    
        main.innerHTML = '';
        main.appendChild(taskListPage)
    }

    if(e.target.dataset.action === 'open-todo') {
        const todoDate = getTodoDataById(e.target.dataset.id);
        const todoPage = createElms.todoPage(todoDate);

        main.innerHTML = '';
        main.appendChild(todoPage);
    }

    if(
        !addMainBtn.contains(e.target)
        && !addMainTooltip.contains(e.target)
        && addMainBtn.classList.contains('active')
    ) {
        addMainBtn.classList.remove('active');
        addMainTooltip.classList.remove('active')
    }
});

addMainBtn.addEventListener('click', (e) => {
    addMainBtn.classList.toggle('active');
    addMainTooltip.classList.toggle('active');
})
