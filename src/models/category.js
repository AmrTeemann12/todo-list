const DEFAULT_CATEGORIES = ['general', 'work', 'personal', 'family', 'entertainment'];
const local = localStorage.getItem('categories');
const categoryList = local? JSON.parse(local) : DEFAULT_CATEGORIES; 

function updateCategoryList(newCatList) {
    const newCatListStr = JSON.stringify(newCatList);
    localStorage.setItem('categories', newCatListStr);
    return true;
}

export function categoryAdd(name) {
    if(categoryList.includes(name.toLowerCase())) {
        throw new Error('category name must be unique');
    }

    if(name.trim() === '') {
        throw new Error('category name can\'t be empty')
    }

    if(name.length > 50) {
        throw new Error('max category name length exceeded')
    }

    categoryList.push(name.toLowerCase());
    updateCategoryList(categoryList);
    return true;
}

export function categoryNames() {
    return categoryList.map(category => category)
}

export function categoryRename(oldName, newName) {
    const index = categoryList.findIndex(category => category === oldName.toLowerCase())

    if(categoryList[index] === 'general') {
        throw new Error('general category can\'t be renamed')
    }

    if(oldName === newName) return true;
    
    if(categoryList.includes(newName.toLowerCase())) {
        throw new Error('category name must be unique');
    }
    
    if(newName.trim() === '') {
        throw new Error('category name can\'t be empty')
    }

    if(newName.length > 50) {
        throw new Error('max category name length exceeded')
    }

    categoryList[index] = newName.toLowerCase();
    updateCategoryList(categoryList);
    return true;
}

export function categoryDelete(categoryName) {
    const index = categoryList.findIndex(category => category === categoryName.toLowerCase());
    
    if(index === -1) {
        throw new Error('invalid category name')
    }
    
    if(categoryList[index] === 'general') {
        throw new Error('general category can\'t be deleted')
    }
    
    categoryList.splice(index, 1);
    updateCategoryList(categoryList);
    return true
}
