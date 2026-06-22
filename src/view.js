import {format, formatDistanceToNowStrict, formatDistanceStrict} from "date-fns";

const editIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20px" viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>';
const addIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20px" viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>';
const deleteIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20px" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';
const closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20px" viewBox="0 0 24 24"><path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg>'

const createElm = document.createElement.bind(document);

function capitalizeFirstLetterAll(string) {
    const splitted = string.split(' ');
    const normalized = splitted.map(item => `${item.charAt(0).toUpperCase()}${item.slice(1).toLowerCase()}`);
    return normalized.join(' ');
}

function formatDate(date) {
    if(!date) return "Not set"
    return format(date, "yyyy/MM/dd hh:mm a");
}

function calcDistanceFromNow(todo) {
    if(todo.startDate > new Date()) return `starts in ${formatDistanceToNowStrict(todo.startDate)}`;
    if(todo.due > new Date())  return `due in ${formatDistanceToNowStrict(todo.due)}`;
    return " ";
}

export const createElms = {

    //===================
    //navbar
    //===================
    navCategories(catListObj) {
        const navCategoriesList = document.createElement('div');
        navCategoriesList.classList.add('nav-categories');

        for(let catName in catListObj) {
            const category = createElm('div');
            const categoryHeader = createElm('div');
            const categoryName = createElm('button');
            const categoryButtons = createElm('span');
            const categoryAddList = createElm('button');
            const categoryList = createElm('ul');

            category.classList.add('nav-category');
            category.dataset.category = catName;

            categoryName.textContent = capitalizeFirstLetterAll(catName);
            categoryName.dataset.action = 'open-category';

            categoryAddList.innerHTML = addIcon;
            categoryAddList.classList.add('nav-icon-btn');
            categoryAddList.dataset.action = 'add-list-to-category'

            categoryButtons.appendChild(categoryAddList)

            categoryHeader.classList.add('nav-category-header');
            categoryHeader.append(categoryName, categoryButtons);

            if(catName !== 'general') {
                const categoryEdit = createElm('button');
                
                categoryEdit.innerHTML = editIcon;
                categoryEdit.classList.add('nav-icon-btn');
                categoryEdit.dataset.action = 'edit-category';

                categoryButtons.appendChild(categoryEdit)
            }

            catListObj[catName].forEach(list => {
                const categoryListItem = createElm('li');
                const categoryListItemTitle = createElm('button');
                
                categoryListItemTitle.textContent = list.title;
                categoryListItemTitle.dataset.id = list.id;
                categoryListItemTitle.dataset.action = 'open-tasklist';
                categoryListItemTitle.classList.add('nav-list-title');

                categoryListItem.appendChild(categoryListItemTitle);

                categoryList.appendChild(categoryListItem);
            })

            category.append(categoryHeader, categoryList);

            if(catName === 'general') {
                navCategoriesList.prepend(category);
            } else {
                navCategoriesList.append(category)
            }
        }

        return navCategoriesList;
    },

    //===================
    //todo list view
    //===================
    todoListItem(todo) {
        const todoItem = createElm('li');
        const todoCheck = createElm('input');
        const todoTitle = createElm('h3');
        const timeDistance = createElm('span');
        const todoPriority = createElm('span');
            
        todoItem.classList.add('todo-list-item');
        todoItem.dataset.id = todo.id;
        todoItem.dataset.listId = todo.listId;
        if(todo.completed) {
            todoItem.classList.add('todo-completed'); 
        } else if(todo.dueStat) {
            todoItem.classList.add(todo.dueStat);
        }

        todoCheck.type = 'checkbox';
        todoCheck.dataset.action = 'toggle-todo-stat';
        todoCheck.checked = todo.completed;

        todoTitle.textContent = todo.title;
        todoTitle.dataset.action = 'open-todo';

        todoPriority.textContent = todo.priority;
        todoPriority.classList.add(`priority-${todo.priority}`, 'todo-priority');

        timeDistance.textContent = calcDistanceFromNow(todo);
        timeDistance.classList.add('todo-time-distance');

        todoItem.append(todoCheck, todoTitle, timeDistance, todoPriority)
        return todoItem;
    },

    todosList(todos) {
        const list = createElm('ul');
        todos.forEach(todo => {
            const todoListItem = this.todoListItem(todo);
            list.appendChild(todoListItem);
        })
        return list;
    },

    //=====================
    //tasklist list view
    //=====================
    taskListListItem(list) {
        const taskListItem = createElm('li');
        const listTitle = createElm('h2');
        const listStat = createElm('span');

        taskListItem.classList.add('tasklist-list-item');
        
        listTitle.textContent = list.title;
        listTitle.dataset.id = list.id;
        listTitle.dataset.action = 'open-tasklist';

        listStat.textContent = list.stat;
        listStat.classList.add('list-stat', `list-stat-${list.stat.split(' ').join('-')}`);

        taskListItem.append(listTitle, listStat);
        
        if(list.stat === 'doing') {
            const todoList = this.todosList(list.todos);
            todoList.classList.add('tasklist-todo-list');
        
            taskListItem.appendChild(todoList);
        }

        return taskListItem;
    },

    taskListsList(lists) {
        const listElm = createElm('ul');

        lists.forEach(list => {
            const taskListItem = this.taskListListItem(list);
            listElm.appendChild(taskListItem);
        })

        return listElm;
    },

    //===================
    //pages
    //===================
    todayPage(todos) {
        const container = createElm('div');
        const todayPageHeader = createElm('h1');
        const contentContainer = createElm('div');
        const todayPageList = createElm('ul');

        container.classList.add('today-page-container');

        todayPageHeader.textContent = 'Today\'s Tasks';

        todayPageList.classList.add('badged-todo-list');
        todos.forEach(todo => {
            const taskList = createElm('span');
            const todoListItem = this.todoListItem(todo);

            taskList.textContent = todo.list;
            taskList.classList.add('top-badge');

            todoListItem.prepend(taskList);

            todayPageList.append(todoListItem)
        })

        contentContainer.classList.add('content-container');
        contentContainer.appendChild(todayPageList);

        container.append(todayPageHeader, contentContainer);
        return container;
    },

    allTodoPage(todosObj) {
        const container = createElm('div');
        const header = createElm('h1');
        const contentContainer = createElm('div');

        const past = this.todosForTimePeriod('past tasks', todosObj['past']);
        const today = this.todosForTimePeriod('today\'s tasks', todosObj['today']);
        const tomorrow = this.todosForTimePeriod('tomorrow\'s tasks', todosObj['tomorrow']);
        const thisWeek = this.todosForTimePeriod('week\'s tasks', todosObj['thisWeek']);
        const later = this.todosForTimePeriod('later tasks', todosObj['later']);

        container.classList.add('all-to-do-container');
        
        header.textContent = 'All Tasks'

        contentContainer.classList.add('content-container');
        contentContainer.append(today, tomorrow, thisWeek, later, past);

        container.append(header, contentContainer)

        return container;
    },

    allListsPage(lists) {
        const container = createElm('div');
        const header = createElm('h1');
        const contentContainer = createElm('div');
        const listElm = createElm('ul');

        container.classList.add('all-lists-container');

        header.textContent = 'All Lists'
        
        lists.forEach(list => {
            const listItem = this.taskListListItem(list);
            const listCategory = createElm('span');

            listCategory.textContent = list.category;
            listCategory.classList.add('top-badge')

            listItem.prepend(listCategory);
            listElm.append(listItem);
        })

        listElm.classList.add('badged-tasklist-list');

        contentContainer.classList.add('content-container');
        contentContainer.appendChild(listElm);

        container.append(header, contentContainer);
        return container;
    },

    categoryPage(catName, lists) {
        const container = createElm('div');
        const categoryHeader = createElm('h1');
        const contentContainer = createElm('div');
        const taskBar = this.taskBar('add-list-to-category', 'edit-category', 'delete-category', 'category');
        const categoryLists = this.taskListsList(lists);
        
        container.classList.add('category-container');
        categoryHeader.textContent = catName;

        contentContainer.classList.add('content-container');
        contentContainer.appendChild(categoryLists)
        if(catName !== 'general') {
            taskBar.dataset.category = catName;
            contentContainer.appendChild(taskBar);
        } else {
            const generalTaskBar = createElm('div');
            const addBtn = createElm('button');

            addBtn.dataset.action = 'add-list-to-category';
            addBtn.innerHTML = addIcon;
            addBtn.title = 'add list to category'

            generalTaskBar.classList.add('task-bar')
            generalTaskBar.appendChild(addBtn);
            generalTaskBar.dataset.category = catName;

            contentContainer.appendChild(generalTaskBar);
        }

        container.append(categoryHeader, contentContainer);
        return container;
    },

    taskListPage(list) {
        const container = createElm('div');
        const title = createElm('h1');
        const contentContainer = createElm('div');
        const taskBar = this.taskBar('add-task-to-list', 'edit-tasklist', 'delete-tasklist', 'list');
        const category = createElm('span');
        const todoList = this.todosList(list.todos)

        container.classList.add('list-container');
        container.dataset.id = list.id;

        category.textContent = list.category;
        category.classList.add('category-and-list-view');

        title.textContent = capitalizeFirstLetterAll(list.title);
        title.appendChild(category);

        taskBar.dataset.id = list.id;

        contentContainer.classList.add('content-container');
        contentContainer.append(todoList, taskBar);

        container.append(title, contentContainer);
        return container;
    },

    todoPage(todo) {
        const container = createElm('div');
        const list = createElm('span');
        const title = createElm('h1');
        const content = createElm('div');
        const contentContainer = createElm('div')
        const taskBar = this.taskBar('', 'edit-todo', 'delete-todo', 'task');

        const dateRow = this.todoDetailRow('Date', formatDate(todo.startDate));
        const dueRow = this.todoDetailRow('Due', formatDate(todo.due));
        const priorityRow = this.todoDetailRow('Priority', todo.priority);
        const descRow = this.todoDetailRow('Description', todo.desc || 'No description');
        const statRow = createElm('div');
        const statLabel = createElm('span');
        const statValue = createElm('input');

        container.classList.add('todo-container');
        container.dataset.id = todo.id;
        container.dataset.listId = todo.listId;
        
        list.textContent = todo.list;
        list.classList.add('category-and-list-view');

        title.textContent = todo.title;
        title.appendChild(list);

        statLabel.textContent = 'Status:';
        statLabel.classList.add('todo-detail-label')
        statValue.type = 'checkbox';
        statValue.checked = todo.completed;
        statValue.dataset.action = 'toggle-todo-stat';

        statRow.append(statLabel, statValue);
        
        content.classList.add('todo-details', 'content-container');
        content.append(
            statRow,
            dateRow,
            priorityRow,
            dueRow,
            descRow
        )

        taskBar.firstElementChild.remove();
        taskBar.dataset.id = todo.id;
        taskBar.dataset.listId = todo.listId;

        contentContainer.classList.add('content-container');
        contentContainer.append(content, taskBar)

        container.append(title, contentContainer);

        return container
    },

    //====================
    //dialog
    //====================
    dialogElm(form) {
        const dialog = createElm('dialog');
        const closeBtn = createElm('button');
        const errorDisplay = createElm('div');

        closeBtn.innerHTML = closeIcon;
        closeBtn.dataset.action = 'close-dialog';
        closeBtn.classList.add('close-btn');

        errorDisplay.classList.add('error-display');
        
        dialog.append(closeBtn, form, errorDisplay);
        
        return dialog;
    },

    //=====================
    //forms
    //=====================
    addCategoryForm() {
        const form = createElm('form');
        const formHeader = createElm('h2');
        const titleInput = this.formControlTextInput('Title', 'category-title', 50, true);
        const submit = this.formSubmitButton('submit-add-category', 'Add category');

        formHeader.textContent = 'Add new category';

        form.classList.add('category-form');
        form.append(formHeader, titleInput, submit);
        
        return form;
    },

    editCategoryForm(categoryName) {
        const form = createElm('form');
        const formHeader = createElm('h2');
        const titleInput = this.formControlTextInput('Title', 'category-title', 50, true, categoryName);
        const submit = this.formSubmitButton('submit-edit-category', 'Edit category');

        formHeader.textContent = 'Edit category';

        form.dataset.category = categoryName;
        form.classList.add('category-form');
        form.append(formHeader, titleInput, submit);

        return form;
    },

    confirmDeleteCategoryForm(categoryName) {
        const form = createElm('form');
        const formHeader = createElm('h2');
        const submit = this.formSubmitButton('submit-delete-category', 'Delete category');

        formHeader.textContent = `Delete "${categoryName}" category`;
        
        form.dataset.category = categoryName;
        form.classList.add('category-form');
        form.append(formHeader, submit);

        return form;
    },

    addTasklistForm(categoriesList, defaultCategory) {
        const form = createElm('form');
        const formHeader = createElm('h2');
        const titleInput = this.formControlTextInput('Title', 'tasklist-title', 100, true);
        const categoryInput = this.formControlSelect('Category', 'category-select', categoriesList, defaultCategory);
        const submit = this.formSubmitButton('submit-add-tasklist', 'Add list');
    
        formHeader.textContent = 'Add new task list';

        form.classList.add('tasklist-form');
        form.append(formHeader, titleInput, categoryInput, submit);

        return form;
    },

    editTasklistForm(categoriesList, tasklist) {
        const form = createElm('form');
        const formHeader = createElm('h2');
        const titleInput = this.formControlTextInput('Title', 'tasklist-title', 100, true, tasklist.title);
        const categoryInput = this.formControlSelect('Category', 'category-select', categoriesList, tasklist.category);
        const submit = this.formSubmitButton('submit-edit-tasklist', 'Edit list');
    
        formHeader.textContent = 'Edit task list';

        form.dataset.id = tasklist.id
        form.classList.add('tasklist-form');
        form.append(formHeader, titleInput, categoryInput, submit);

        return form;
    },

    confirmDeleteTasklistForm(listName, listId) {
        const form = createElm('form');
        const formHeader = createElm('h2');
        const submit = this.formSubmitButton('submit-delete-tasklist', 'Delete list');

        formHeader.textContent = `Delete "${listName}" list`;
        
        form.dataset.id = listId;
        form.classList.add('tasklist-form');
        form.append(formHeader, submit);

        return form
    },

    addTodoForm(minDate, defaultDate, listId) {
        const form = createElm('form');
        const formHeader = createElm('h2');
        const titleInput = this.formControlTextInput('Title', 'todo-title', 100, true);
        const priorityInput = this.formControlSelect('Priority', 'todo-priority', ['high', 'moderate', 'low'], 'moderate');
        const startDateInput = this.formControlDate('Start date', 'todo-start-date', minDate, 'set-start-date', true, defaultDate);
        const dueDateInput = this.formControlDate('Due date', 'todo-due', minDate, 'set-due-date');
        const descInput = this.formControlTextInput('Description', 'todo-desc', 500);
        const submit = this.formSubmitButton('submit-add-todo', 'Add task');
    
        formHeader.textContent = 'Add new task';

        form.classList.add('todo-form');
        form.append(formHeader, titleInput, priorityInput, startDateInput, dueDateInput, descInput, submit);
        form.dataset.listId = listId;

        return form;
    },

    editTodoForm(createDate, startDate, dueDate, todo) {
        const form = createElm('form');
        const formHeader = createElm('h2');
        const titleInput = this.formControlTextInput('Title', 'todo-title', 100, true, todo.title);
        const priorityInput = this.formControlSelect('Priority', 'todo-priority', ['high', 'moderate', 'low'], todo.priority);
        const startDateInput = this.formControlDate('Start date', 'todo-start-date', createDate, 'set-start-date', true, startDate, dueDate);
        const dueDateInput = this.formControlDate('Due date', 'todo-due', startDate, 'set-due-date', false, dueDate);
        const descInput = this.formControlTextInput('Description', 'todo-desc', 500, false, todo.desc);
        const submit = this.formSubmitButton('submit-edit-todo', 'Edit task');
    
        formHeader.textContent = 'Edit task';

        form.classList.add('todo-form');
        form.append(formHeader, titleInput, priorityInput, startDateInput, dueDateInput, descInput, submit);
        form.dataset.listId = todo.listId;
        form.dataset.id = todo.id;

        return form;  
    },

    confirmDeleteTodoForm(listId, todoId) {
        const form = createElm('form');
        const submit = this.formSubmitButton('submit-delete-todo', 'Delete task');
        
        form.dataset.id = todoId;
        form.dataset.listId = listId
        form.classList.add('todo-form');
        form.append(submit);

        return form
    },

    //=====================
    //helpers
    //=====================
    todosForTimePeriod(timePeriodName, todos) {
        const container = createElm('div');
        const header = createElm('h2');
        const todosList = createElm('ul');

        const className = timePeriodName.toLowerCase().split(' ');
        const classNameNormalized = className.map(name => {
            if(name.endsWith("'s")) return name.slice(0, -2);
            return name
        })

        container.classList.add(`${classNameNormalized.join('-')}`);

        header.textContent = capitalizeFirstLetterAll(timePeriodName);

        todos.forEach(todo => {
            const taskList = createElm('span');
            const todoListItem = this.todoListItem(todo);

            taskList.textContent = todo.list;
            taskList.classList.add('top-badge');

            todoListItem.prepend(taskList);

            todosList.append(todoListItem)
        })

        todosList.classList.add('badged-todo-list');

        container.append(header, todosList);
        return container;
    },

    todoDetailRow(label, value) {
        const row = createElm('div');
        const labelSpan = createElm('span');
        const valueSpan =createElm('span');

        labelSpan.textContent = label + ':';
        labelSpan.classList.add('todo-detail-label')
        valueSpan.textContent = value;

        row.append(labelSpan, valueSpan);
        return row;
    },

    taskBar(addAction, editAction, deleteAction, page) {
        const bar = createElm('div');
        const editBtn = createElm('button');
        const addBtn = createElm('button');
        const deleteBtn = createElm('button');
        
        bar.classList.add('task-bar');

        editBtn.dataset.action = editAction;
        editBtn.innerHTML = editIcon;
        editBtn.title = `edit ${page}`
        
        addBtn.dataset.action = addAction;
        addBtn.innerHTML = addIcon;
        addBtn.title = `${addAction.split('-').join(' ')}`

        deleteBtn.dataset.action = deleteAction;
        deleteBtn.innerHTML = deleteIcon;
        deleteBtn.title = `permanently delete ${page}`

        bar.append(addBtn, editBtn, deleteBtn);
        return bar;
    },

    formControlTextInput(label, name, maxLength, required = false, value) {
        const container = createElm('div');
        const labelElm = createElm('label');
        const inputElm = createElm('input');

        labelElm.textContent = label;
        labelElm.htmlFor = name;

        inputElm.type = 'text';
        inputElm.id = name;
        inputElm.name = name;

        if(value) inputElm.value = value;
        if(maxLength) inputElm.setAttribute('maxlength', maxLength);
        if(required) inputElm.required = true;

        
        container.classList.add('form-control');
        container.append(labelElm, inputElm);

        return container;
    },

    formControlSelect(label, name, options, defaultOption) {
        const container = createElm('div');
        const labelElm = createElm('label');
        const selectElm = createElm('select');

        labelElm.textContent = label;
        labelElm.htmlFor = name;

        selectElm.id = name;
        selectElm.name = name;

        options.forEach(option => {
            const optionElm = createElm('option');

            optionElm.value = option;
            optionElm.textContent = option;

            if(defaultOption && option === defaultOption) optionElm.selected = true;

            selectElm.appendChild(optionElm);
        })

        container.classList.add('form-control');
        container.append(labelElm, selectElm);

        return container;
    },

    formControlDate(label, name, after, action, required = false, value, before) {
        const container = createElm('div');
        const labelElm = createElm('label');
        const inputElm = createElm('input');

        labelElm.textContent = label;
        labelElm.htmlFor = name;

        inputElm.type = 'datetime-local';
        inputElm.id = name;
        inputElm.name = name;
        inputElm.min = after;
        inputElm.dataset.action = action;

        if(required) inputElm.required = true;
        if(value) inputElm.value = value;
        if(before) inputElm.max = before;

        container.classList.add('form-control');
        container.append(labelElm, inputElm);

        return container;
    },

    formSubmitButton(action, text) {
        const submit = createElm('button');

        submit.type = 'button';
        submit.textContent = text;
        submit.dataset.action = action;
        submit.classList.add('submit-btn');

        return submit;
    },
}