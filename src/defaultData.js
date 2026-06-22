import { addDays } from 'date-fns';

const today = new Date();
const tomorrow = addDays(today, 1);
const nextWeek = addDays(today, 7);

// Helper to create complete todo data
function createTodo(title, priority = 'moderate', desc = '', startDate = today, due = null) {
    const obj = {
        title,
        priority,
        desc,
        startDate,
        due,
        dateCreated: today,
        completed: false,
        id: crypto.randomUUID(),
    };
    
    return obj;
}

export const DEFAULT_LISTS = [
    {
        title: 'Getting Started',
        category: 'general',
        id: crypto.randomUUID(),
        todos: [
            createTodo(
                'Welcome to your Todo App!',
                'high',
                'This is your first task - you can edit or delete it anytime',
                today,
                tomorrow
            ),
            createTodo(
                'Create a new list',
                'moderate',
                'Click the + button to add a new task list',
                today,
                null
            ),
            createTodo(
                'Try checking this off',
                'low',
                'Click the checkbox to mark tasks as complete',
                today,
                null
            ),
        ],

        readTodos() {
            return this.todos.map(item => ({
                dateCreated: item.dateCreated,
                id: item.id,
                title: item.title,
                priority: item.priority,
                startDate: item.startDate,
                desc: item.desc,
                due: item.due,
                completed: item.completed,
            }))
        }
    },
    {
        title: 'Work',
        category: 'work',
        id: crypto.randomUUID(),
        todos: [
            createTodo(
                'Review project requirements',
                'high',
                'Read through the project specs and make notes',
                today,
                tomorrow
            ),
            createTodo(
                'Schedule team meeting',
                'moderate',
                'Find a time that works for everyone',
                today,
                addDays(today, 3)
            ),
        ],
        readTodos() {
            return this.todos.map(item => ({
                dateCreated: item.dateCreated,
                id: item.id,
                title: item.title,
                priority: item.priority,
                startDate: item.startDate,
                desc: item.desc,
                due: item.due,
                completed: item.completed,
            }))
        }
    },
    {
        title: 'Personal',
        category: 'personal',
        id: crypto.randomUUID(),
        todos: [
            createTodo(
                'Buy groceries',
                'high',
                'Milk, eggs, bread, and vegetables',
                today,
                tomorrow
            ),
            createTodo(
                'Plan weekend trip',
                'low',
                'Research destinations and book accommodation',
                today,
                nextWeek
            ),
        ],
        readTodos() {
            return this.todos.map(item => ({
                dateCreated: item.dateCreated,
                id: item.id,
                title: item.title,
                priority: item.priority,
                startDate: item.startDate,
                desc: item.desc,
                due: item.due,
                completed: item.completed,
            }))
        }
    },
];