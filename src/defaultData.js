import { addDays, subDays, subHours, addHours, subMinutes } from 'date-fns';

const today = new Date();
const tomorrow = addDays(today, 1);
const nextWeek = addDays(today, 7);
const yesterday = subDays(today, 1);
const twoDaysAgo = subDays(today, 2);
const hourLater = addHours(today, 1);
const twoHoursLate = addHours(today, 2);
const hourAgo = subHours(today, 1);
const halfHourAgo = subMinutes(today, 30);
const halfHourLater = subMinutes(hourLater, 30);

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
                tomorrow,
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
                nextWeek,
            ),
            createTodo(
                'Plan weekend trip',
                'low',
                'Research destinations and book accommodation',
                tomorrow,
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
    {
        title: 'movies',
        category: 'entertainment',
        id: crypto.randomUUID(),
        todos: [
                {
                    title: 'Dr. Strangelove',
                    priority: 'high',
                    desc: 'great dark comedy movie from the 60s directed by stanley kubrick',
                    dateCreated: today,
                    startDate: today,
                    due: hourLater,
                    completed: true,
                    id: crypto.randomUUID(),
                },
                {
                    title: 'Spirited Away',
                    priority: 'moderate',
                    desc: 'dazzling, warm, and gorgeously drawn anime movie directed by Hayao Miyazaki',
                    dateCreated: yesterday,
                    startDate: today,
                    due: hourLater,
                    completed: false,
                    id: crypto.randomUUID(),
                },
                {
                    title: 'Fantastic Mr.Fox',
                    priority: 'high',
                    desc: 'delightfully funny, and visually appealing stop motion movie directed by Wes Anderson',
                    dateCreated: yesterday,
                    startDate: hourAgo,
                    due: halfHourAgo,
                    completed: false,
                    id: crypto.randomUUID(),
                },
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