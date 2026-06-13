import { addDays, addHours, addWeeks, isBefore, startOfToday, startOfTomorrow } from 'date-fns';

//sort array of todos by date
function sortAsc(todos) {
    todos.sort((a, b) => a.startDate - b.startDate);
}

//take array of lists as argument
//return an object with time sorted arrays of todos
export function allTodosTimeArrange(lists) {
    const pastTodos = [];
    const todayTodos = [];
    const tomorrowTodos = [];
    const thisWeekTodos = [];
    const laterTodos = [];
    
    const today = startOfToday();
    const tomorrow = startOfTomorrow();
    const afterTomorrow = addDays(startOfTomorrow(), 1);
    const nextWeek = addWeeks(startOfToday(), 1);

    lists.forEach(list => {
        list.todos.forEach(todo => {
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
        })
    });

    sortAsc(pastTodos);
    sortAsc(todayTodos);
    sortAsc(tomorrowTodos);
    sortAsc(thisWeekTodos);
    sortAsc(laterTodos);

    return {
        pastTodos,
        todayTodos,
        tomorrowTodos,
        thisWeekTodos,
        laterTodos,
        allTodos: pastTodos.concat(todayTodos, tomorrowTodos, thisWeekTodos, laterTodos)
    };
}

//take a taskList as argument
//return a sorted array of todos
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
