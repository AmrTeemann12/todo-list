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
    changeCategoryTitle,
    removeCategory,
} from './listsManager.js';
import {
    allTodosTimeArrange,
    checkDue,
    listTodosTimeArrange,
    getListCategories,
    getListDataByListId,
    getTodoDataById,
} from './presenter.js';
import {
    createElms,
 } from './view.js';
 import './style.css';
import { categoryAdd, categoryDelete, categoryNames } from './models/category.js';
import { format, addHours } from 'date-fns';

const navbar = document.querySelector('nav');
const main = document.querySelector('main');
const altNav = document.querySelector('.alt-nav');
const addMainBtn = document.querySelector('#add-main');
const addMainTooltip = document.querySelector('#add-main-tooltip');
const addTasklistMain = document.querySelector('#add-tasklist-main');
const addCategoryMain = document.querySelector('#add-category-main');

function loadCategories() {
    const oldCategoryList = document.querySelector('nav > .nav-categories');
    if(oldCategoryList) {
        oldCategoryList.remove()
    }
    const categoriesElem = createElms.navCategories(getListCategories())
    navbar.append(categoriesElem)
}

function loadTodayPage() {
    const todayTodos = allTodosTimeArrange().today;
    const todayPageElem = createElms.todayPage(todayTodos)
        
    main.innerHTML = '';
    main.appendChild(todayPageElem);
}

function loadAllListsPage() {
    const lists = readAllLists();
    
    //add list todo and list id as it's not provided for the list version
    lists.forEach(list => {
        list.todos.forEach(todo => {
            todo.list = list.title;
            todo.listId = list.id;
            todo.dueStat = checkDue(todo)
        })
    })

    const allListsPage = createElms.allListsPage(lists);
        
    main.innerHTML = '';
    main.appendChild(allListsPage);
}

function loadCategoryPage(categoryName) {
    const listCategory = getListCategories()[categoryName];

    //add list todo and list id as it's not provided for the list version
    listCategory.forEach(list => {
        list.todos.forEach(todo => {
            todo.list = list.title;
            todo.listId = list.id;
            todo.dueStat = checkDue(todo);
        })
    })

    const categoryPage = createElms.categoryPage(categoryName, listCategory);

    main.innerHTML = '';
    main.appendChild(categoryPage);
}

function loadTasklistPage(listId) {
    const list = getListDataByListId(listId);
    
    //add list todo and list id as it's not provided for the list version
    list.todos.forEach(todo => {
        todo.list = list.title;
        todo.listId = list.id;
        todo.dueStat = checkDue(todo);
    })

    const taskListPage = createElms.taskListPage(list);
    
    main.innerHTML = '';
    main.appendChild(taskListPage)
}

function loadTodoPage(todoId) {
    const todoData = getTodoDataById(todoId);
    const todoPage = createElms.todoPage(todoData);

    main.innerHTML = '';
    main.appendChild(todoPage);
}

function showFormError(message) {
    const errorDisplay = document.querySelector('.error-display');

    errorDisplay.textContent = message;
}

function showDialog(form) {
    const dialog = createElms.dialogElm(form);
    document.body.appendChild(dialog);
    dialog.showModal();
}

function formatDateValue(date) {
    if(!date) return null;
    return `${format(date, 'yyyy-MM-dd')}T${format(date, 'HH:mm')}`;
}

loadCategories()

function handleNavigation(e) {
    if(e.target.id === 'today') {
        loadTodayPage();
    }

    if(e.target.id === 'all-to-dos') {
        const todosObj = allTodosTimeArrange();
        const allTodosPage = createElms.allTodoPage(todosObj);
        
        main.innerHTML = '';
        main.appendChild(allTodosPage);
    }

    if(e.target.id === 'all-lists') {
        loadAllListsPage();
    }

    if(e.target.id === 'menu') {
        const categoriesElm = createElms.navCategories(getListCategories());
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20px" viewBox="0 0 24 24"><title>close</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>';
        closeBtn.classList.add('close-btn');
        closeBtn.dataset.action = 'close-menu';

        altNav.innerHTML = '';
        altNav.append(closeBtn, categoriesElm);
        altNav.classList.add('active');
    }

    if(e.target.dataset.action === 'open-category') {
        const categoryName = e.target.textContent.toLowerCase();
        loadCategoryPage(categoryName);
    }

    if(e.target.dataset.action === 'open-tasklist') {
        const listId = e.target.dataset.id;
        loadTasklistPage(listId);
    }

    if(e.target.dataset.action === 'open-todo') {
        const todoId = e.target.closest('[data-id]').dataset.id;
        loadTodoPage(todoId);
    }

    if(e.target.dataset.action === 'close-dialog') {
        const dialog = document.querySelector('dialog');
    
        dialog.close();
        dialog.remove();
    }

    if(e.target.dataset.action === 'close-menu') {
        altNav.classList.remove('active');
    }
}

function handleAddActions(e) {
    if(e.target.dataset.action === 'add-tasklist') {
        const form = createElms.addTasklistForm(categoryNames(), 'general');
        showDialog(form);
    }

    if(e.target.dataset.action === "add-list-to-category") {
        const category = e.target.closest('[data-category]').dataset.category;
        const form = createElms.addTasklistForm(categoryNames(), category);
        showDialog(form);
    }

    if(e.target.dataset.action === 'add-task-to-list') {
        const now = new Date();
        const oneHourLater = addHours(new Date(), 1);
        const nowFormatted = formatDateValue(now);
        const oneHourLaterFormatted = formatDateValue(oneHourLater)
        const listId = e.target.closest('[data-id]').dataset.id;
        const form = createElms.addTodoForm(nowFormatted, oneHourLaterFormatted, listId);
        showDialog(form);
    }
}

function handleEditActions(e) {
    if(e.target.dataset.action === 'edit-category') {
        const categoryName = e.target.closest('[data-category]').dataset.category;
        const form = createElms.editCategoryForm(categoryName);
        showDialog(form);
    }

    if(e.target.dataset.action === 'edit-tasklist') {
        const listId = e.target.closest('[data-id]').dataset.id;
        const list = getListDataByListId(listId);

        const form = createElms.editTasklistForm(categoryNames(), list);
        showDialog(form);
    }

    if(e.target.dataset.action === 'edit-todo') {
        const todoId = e.target.closest('[data-id]').dataset.id;
        const todo = getTodoDataById(todoId);

        const createDate = formatDateValue(todo.dateCreated);
        const startDate = formatDateValue(todo.startDate);
        const dueDate = formatDateValue(todo.due);

        const form = createElms.editTodoForm(createDate, startDate, dueDate, todo);

        showDialog(form);
    }
}

function handleDeleteActions(e) {
    if(e.target.dataset.action === 'delete-category') {
        const categoryName = e.target.closest('[data-category]').dataset.category;
        const form = createElms.confirmDeleteCategoryForm(categoryName);
        showDialog(form);
    }

    if(e.target.dataset.action === 'delete-tasklist') {
        const listId = e.target.closest('[data-id]').dataset.id;
        const list = getListDataByListId(listId);

        const form = createElms.confirmDeleteTasklistForm(list.title, listId);
        showDialog(form);
    }

    if(e.target.dataset.action === 'delete-todo') {
        const todoId = e.target.closest('[data-id]').dataset.id;
        const listId = e.target.closest('[data-list-id]').dataset.listId;

        const form = createElms.confirmDeleteTodoForm(listId, todoId);
        showDialog(form);
    }
}

function handleFormSubmit(e) {
    if(e.target.dataset.action === 'submit-add-category') {
        const titleInput = document.querySelector('#category-title');
        const title = titleInput.value.toLowerCase();
        const dialog = document.querySelector('dialog');
        const form = e.target.parentElement;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if(title.trim() === '') {
            showFormError('title can\'t be empty')
            return;
        }

        if(categoryNames().includes(title)) {
            showFormError('new category name must be unique');
            return;
        }

        categoryAdd(title);

        dialog.close();
        dialog.remove();
        loadCategories();
    }

    if(e.target.dataset.action === 'submit-edit-category') {
        const titleInput = document.querySelector('#category-title');
        const title = titleInput.value.toLowerCase();
        const dialog = document.querySelector('dialog');
        const form = e.target.parentElement;
        const oldName = form.dataset.category;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if(title.trim() === '') {
            showFormError('title can\'t be empty')
            return;
        }

        if(title === oldName) {
            dialog.close();
            dialog.remove();
            return;
        }

        if(categoryNames().includes(title)) {
            showFormError('new category name must be unique');
            return;
        }

        changeCategoryTitle(oldName, title);

        dialog.close();
        dialog.remove();
        loadCategories();

        if(main.contains(main.querySelector(`[data-category=${oldName}]`))){
            loadCategoryPage(title);
        }
    }

    if(e.target.dataset.action === 'submit-delete-category') {
        const dialog = document.querySelector('dialog');
        const form = e.target.parentElement;
        const categoryName = form.dataset.category;

        if(!categoryNames().includes(categoryName)) {
            showFormError('invalid category name');
            return;
        }

        removeCategory(categoryName);

        dialog.close();
        dialog.remove();
        loadCategories();
        loadTodayPage();
    }

    if(e.target.dataset.action === 'submit-add-tasklist') {
        const titleInput = document.querySelector('#tasklist-title');
        const categoryInput = document.querySelector('#category-select');
        const category = categoryInput.value;
        const title = titleInput.value;
        const dialog = document.querySelector('dialog');
        const form = e.target.parentElement;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if(title.trim() === '') {
            showFormError('title can\'t be empty')
            return;
        }

        if(getListCategories()[category].some(list => list.title === title)) {
            showFormError('this category contains a list with this title');
            return;
        }

        createList(title, category)

        dialog.close();
        dialog.remove();
        loadCategories();

        if(main.contains(main.querySelector(`[data-category=${category}]`))){
            loadCategoryPage(category);
        }
    }

    if(e.target.dataset.action === 'submit-edit-tasklist') {
        const dialog = document.querySelector('dialog');
        const title = document.querySelector('#tasklist-title').value;
        const category= document.querySelector('#category-select').value;
        const form = e.target.parentElement;
        const listId = form.dataset.id;
        const list = getListDataByListId(listId);

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if(title === list.title && category === list.category) {
            dialog.close();
            dialog.remove();
            return;
        }

        if(title !== list.title) {
            if(title.trim() === '') {
                showFormError('title can\'t be empty')
                return;
            }

            if(getListCategories()[category].some(list => list.title === title)) {
                showFormError('this category contains a list with this title');
                return;
            }
            changeListTitle(listId, title);
        }

        if(category !== list.category) {
            if(getListCategories()[category].some(list => list.title === title)) {
                showFormError('this category contains a list with this title');
                return;
            }

            changeListCategory(listId, category);
        }

        dialog.close();
        dialog.remove();
        loadCategories();

        if(main.contains(main.querySelector(`[data-id='${listId}']`))){
            loadTasklistPage(listId);
        }
    }

    if(e.target.dataset.action === 'submit-delete-tasklist') {
        const dialog = document.querySelector('dialog');
        const form = e.target.parentElement;
        const listId = form.dataset.id;

        removeList(listId)

        dialog.close();
        dialog.remove();
        loadCategories();
        loadTodayPage();
    }

    if(e.target.dataset.action === 'submit-add-todo') {
        const titleVal = document.querySelector('#todo-title').value;
        const priorityVal = document.querySelector('#todo-priority').value;
        const startDateVal = document.querySelector('#todo-start-date').value;
        const dueDateVal = document.querySelector('#todo-due').value;
        const descVal = document.querySelector('#todo-desc').value;
        const dialog = document.querySelector('dialog');
        const form = e.target.parentElement;
        const listId = form.dataset.listId;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if(titleVal.trim() === '') {
            showFormError('title can\'t be empty')
            return;
        }

        addTodoToList(listId, {
            title: titleVal,
            priority: priorityVal,
            desc: descVal,
            startDate: new Date(startDateVal),
            due: dueDateVal? new Date(dueDateVal): null
        });

        dialog.close();
        dialog.remove();
        loadTasklistPage(listId);
    }

    if(e.target.dataset.action === 'submit-edit-todo') {
        const titleVal = document.querySelector('#todo-title').value;
        const priorityVal = document.querySelector('#todo-priority').value;
        const startDateVal = document.querySelector('#todo-start-date').value;
        const dueDateVal = document.querySelector('#todo-due').value;
        const descVal = document.querySelector('#todo-desc').value;
        const dialog = document.querySelector('dialog');
        const form = e.target.parentElement;
        const listId = form.dataset.listId;
        const todoId = form.dataset.id;
        const todo = getTodoDataById(todoId);

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const changes = {};

        if(titleVal !== todo.title) changes.title = titleVal;
        if(priorityVal !== todo.priority) changes.priority = priorityVal;
        if(startDateVal !== formatDateValue(todo.startDate)) changes.startDate = new Date(startDateVal);
        if(dueDateVal !== formatDateValue(todo.due)) changes.due = new Date(dueDateVal);
        if(descVal !== todo.desc) changes.desc = descVal;

        if(Object.keys(changes).length === 0) {
            dialog.close();
            dialog.remove();
            return;
        }

        if(titleVal.trim() === '') {
            showFormError('title can\'t be empty')
            return;
        }

        updateTodoInList(listId, todoId, changes)

        dialog.close();
        dialog.remove();
        loadTodoPage(todoId);
    }

    if(e.target.dataset.action === 'submit-delete-todo') {
        const dialog = document.querySelector('dialog');
        const form = document.querySelector('form');
        const listId = form.dataset.listId;
        const todoId = form.dataset.id;

        removeListTodo(listId, todoId);

        dialog.close();
        dialog.remove();
        loadTodayPage();
    }
}

document.addEventListener('click', (e) => {
    
    handleNavigation(e);
    handleAddActions(e);
    handleEditActions(e);
    handleDeleteActions(e);
    handleFormSubmit(e);

   if(
        !addMainBtn.contains(e.target)
        && !addMainTooltip.contains(e.target)
        && addMainBtn.classList.contains('active')
    ) {
        addMainBtn.classList.remove('active');
        addMainTooltip.classList.remove('active')
    }

    if(e.target.localName === 'button' && altNav.contains(e.target)) {
        altNav.classList.remove('active')
    }
});

document.addEventListener('change', (e) => {
    if(e.target.dataset.action === 'set-start-dat') {
        const dueDate = document.querySelector('#todo-due');
        dueDate.min = e.target.value;
    }

    if(e.target.dataset.action === 'set-due-date') {
        const startDate = document.querySelector('#todo-start-date');
        startDate.max = e.target.value;
    }

    if(e.target.dataset.action === 'toggle-todo-stat') {
        const item = e.target.parentElement;
        const todoId = item.closest('[data-id]').dataset.id;
        const listId = item.closest('[data-list-id]').dataset.listId;
        const todo = getTodoDataById(todoId);
        const list = getListDataByListId(listId);
        const listStat = list.stat;

        const toggled = toggleTodoStatInList(listId, todoId)
        if(!toggled) return;

        if(e.target.checked === true) {
            item.classList.remove('past-due', 'before-due', 'within-hour');
            item.classList.add('todo-completed');
            

        } else {
            const className = checkDue(todo);
            item.classList.remove('todo-completed');
            item.classList.add(className);
        }

        if(getListDataByListId(listId).stat !== listStat) {
            if(main.contains(main.querySelector('.all-lists-container'))) {
                loadAllListsPage();
            } else if(main.contains(main.querySelector('.category-container'))) {
                loadCategoryPage(list.category);
            }
        }
    }
})

document.addEventListener('submit', (e) => e.preventDefault())

addMainBtn.addEventListener('click', () => {
    addMainBtn.classList.toggle('active');
    addMainTooltip.classList.toggle('active');
})

addCategoryMain.addEventListener('click', () => {
    const form = createElms.addCategoryForm();
    showDialog(form);
})
