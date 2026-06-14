import { addDays, addHours, addWeeks, isBefore, startOfToday, startOfTomorrow } from 'date-fns';

//sort array of todos by date
function sortAsc(todos) {
    todos.sort((a, b) => a.startDate - b.startDate);
}

//take array of lists as argument
//return object with keys as categories names/ values as array with its lists
export function sortListCategories(lists, categories) {
    const categoriesList = {};
    categories.forEach(cat => categoriesList[cat] = []);
    
    lists.forEach(list => {
        categoriesList[list.category].push(list)
    })
    
    return categoriesList;
}

//take array of lists as argument
//return an object with a time-base sorted arrays of todos
export function allTodosTimeArrange(lists) {
    const pastTodos = [];
    const todayTodos = [];
    const tomorrowTodos = [];
    const thisWeekTodos = [];
    const laterTodos = [];
    const allTodos = [];
    
    const today = startOfToday();
    const tomorrow = startOfTomorrow();
    const afterTomorrow = addDays(startOfTomorrow(), 1);
    const nextWeek = addWeeks(startOfToday(), 1);

    lists.forEach(list => list.todos.forEach(todo => {
        todo.list = list.title;
        allTodos.push(todo)
    }))
    sortAsc(allTodos);

    allTodos.forEach(todo => {
        const date = todo.startDate;
            
        if(isBefore(date, today)) {
            pastTodos.push(todo);
        } else if(isBefore(date, tomorrow)) {
            todayTodos.push(todo);
        } else if(isBefore(date, afterTomorrow)) {
            tomorrowTodos.push(todo);
        } else if(isBefore(date, nextWeek)) {
            thisWeekTodos.push(todo);
        } else {
            laterTodos.push(todo);
        }
    });

    return {
        pastTodos,
        todayTodos,
        tomorrowTodos,
        thisWeekTodos,
        laterTodos,
        allTodos,
    };
}

//take a taskList as argument
//return a time-base sorted array of todos
export function listTodosTimeArrange(list) {
    sortAsc(list.todos)
    return list.todos;
}

//take array of todos as arguments
//return an object with sorted arrays of todos according to dues
export function checkDues(todos) {
    const pastDue = [];
    const withinOneHour = [];
    const beforeDue = [];

    const now = new Date();
    const oneHourLater = addHours(new Date(), 1);

    todos.forEach(todo => {
        const dueDate = todo.due
        if(dueDate) {
            if(isBefore(dueDate, now)) {
                pastDue.push(todo);
            } else if(isBefore(dueDate, oneHourLater)) {
                withinOneHour.push(todo);
            } else {
                beforeDue.push(todo);
            }
        }
    })

    sortAsc(pastDue);
    sortAsc(withinOneHour);
    sortAsc(beforeDue);

    return {
        pastDue,
        withinOneHour,
        beforeDue,
    };
}
