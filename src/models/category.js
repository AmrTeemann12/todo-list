const categoryList = ['general', 'work', 'family', 'entertainment'];

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
    return true;
}

export function categoryNames() {
    return categoryList.map(category => category)
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
    return true
}
