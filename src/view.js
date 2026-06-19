import { format } from "date-fns";

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

export const createElms = {

    //===================
    //navbar
    //===================
    navCategories(catListObj) {
        const navCategoriesList = document.createElement('div');
        navCategoriesList.classList.add('nav-categories');

        for(let catName in catListObj) {
            const category = createElm('div');
            const categoryName = createElm('button');
            const categoryList = createElm('ul');

            category.classList.add('nav-category');

            categoryName.textContent = capitalizeFirstLetterAll(catName);
            categoryName.dataset.action = 'open-category';

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

            category.append(categoryName, categoryList);

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
        const todoPriority = createElm('span');
            
        todoItem.classList.add('todo-list-item');
        if(todo.dueStat) {
            todoItem.classList.add(todo.dueStat);
        }
        if(todo.completed) {
            todoItem.classList.add('todo-completed'); 
        }

        todoCheck.type = 'checkbox';
        todoCheck.dataset.action = 'toggle-todo-stat';
        todoCheck.checked = todo.completed;

        todoTitle.textContent = todo.title;
        todoTitle.dataset.id = todo.id;
        todoTitle.dataset.action = 'open-todo';

        todoPriority.textContent = todo.priority;
        todoPriority.classList.add(`priority-${todo.priority}`);

        todoItem.append(todoCheck, todoTitle, todoPriority)
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
        listStat.classList.add(`list-stat-${list.stat.split(' ').join('-')}`);

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
        contentContainer.append(past, today, tomorrow, thisWeek, later);

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
        const categoryLists = this.taskListsList(lists);
        
        container.classList.add('category-container');
        categoryHeader.textContent = catName;

        contentContainer.classList.add('content-container');
        contentContainer.appendChild(categoryLists);

        container.append(categoryHeader, contentContainer);
        return container;
    },

    taskListPage(list) {
        const container = createElm('div');
        const title = createElm('h1');
        const contentContainer = createElm('div');
        const category = createElm('span');
        const todoList = this.todosList(list.todos)

        container.classList.add('list-container');
        container.dataset.id = list.id

        category.textContent = list.category;
        category.classList.add('category-and-list-view');

        title.textContent = capitalizeFirstLetterAll(list.title);
        title.appendChild(category);

        contentContainer.classList.add('content-container');
        contentContainer.appendChild(todoList);

        container.append(title, contentContainer);
        return container;
    },

    todoPage(todo) {
        const container = createElm('div');
        const list = createElm('span');
        const title = createElm('h1');
        const contentContainer = createElm('div');

        const dateRow = this.todoDetailRow('Date', formatDate(todo.startDate));
        const dueRow = this.todoDetailRow('Due', formatDate(todo.due));
        const priorityRow = this.todoDetailRow('Priority', todo.priority);
        const descRow = this.todoDetailRow('Description', todo.desc || 'No description');
        const statRow = createElm('div');
        const statLabel = createElm('span');
        const statValue = createElm('input');

        container.classList.add('todo-container');
        container.dataset.id = todo.id;
        
        list.textContent = todo.list;
        list.classList.add('category-and-list-view');

        title.textContent = todo.title;
        title.appendChild(list);

        statLabel.textContent = 'Status:';
        statLabel.classList.add('todo-detail-label')
        statValue.type = 'checkbox';
        statValue.checked = todo.completed;
        statValue.dataset.action = 'toggle-todo';

        statRow.append(statLabel, statValue);

        contentContainer.classList.add('todo-details', 'content-container');
        contentContainer.append(
            statRow,
            dateRow,
            priorityRow,
            dueRow,
            descRow
        )

        container.append(title, contentContainer);

        return container
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
}