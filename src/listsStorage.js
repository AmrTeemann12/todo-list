import { DEFAULT_LISTS } from "./defaultData.js";

if(!localStorage.getItem('listsIds')) {
    DEFAULT_LISTS.forEach(list => {
        storeTaskList(list)
    })
}

function stringifyList(list) {
    const listData = {
        title: list.title,
        category: list.category,
        id: list.id,
        todos: list.readTodos(),
    };

    return JSON.stringify(listData);
}

function getListsIds() {
    let lists = localStorage.getItem('listsIds');
    if(!lists) {
        return [];
    } else {
        return JSON.parse(lists);
    }
}

export function storeTaskList(list) {
    const listDataStr = stringifyList(list);

    let lists = getListsIds();

    if(!lists) {
        lists = [];
    }

    lists.push(list.id);
    

    localStorage.setItem(list.id, listDataStr);
    localStorage.setItem('listsIds', JSON.stringify(lists));
    return true;
}

export function getListsData() {
    const listsIds = getListsIds();
    const lists = [];

    if(listsIds.length === 0) return lists;

    listsIds.forEach(id => {
        const list = localStorage.getItem(id);
        if(!list) return;

        const listParsed = JSON.parse(list);
        lists.push(listParsed);
    })
    return lists;
}

export function updateListInStorage(list) {
    const listStr = stringifyList(list);
    const listInStorage = localStorage.getItem(list.id);
    
    if(!listInStorage) storeTaskList(list);


    localStorage.setItem(list.id, listStr);

    return true;
}

export function removeListInStorage(listId) {
    const listsIds = getListsIds();

    if(!localStorage.getItem(listId)) throw new Error('invalid list id');

    const index = listsIds.findIndex(id => id === listId);
    if(index !== -1) listsIds.splice(index, 1);

    localStorage.removeItem(listId);
    localStorage.setItem('listsIds', JSON.stringify(listsIds))

    return true;
}
