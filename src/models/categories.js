export class Categories {
    static #categoryList = ['general', 'work', 'family', 'entertainment'];

    static add(name) {
        if(Categories.#categoryList.includes(name.toLowerCase())) {
            throw new Error('category name must be unique');
        }

        if(name.length > 50) {
            throw new Error('max category name length exceeded')
        }

        Categories.#categoryList.push(name.toLowerCase());
        return true;
    }

    static names() {
        return Categories.#categoryList.map(category => category)
    }

    static delete(categoryName) {
        const index = Categories.#categoryList.findIndex(category => category === categoryName.toLowerCase());
        if(Categories.#categoryList[index] === 'general') {
            throw new Error('general category can\'t be deleted')
        }
        if(index === -1) {
            throw new Error('invalid category name')
        }
        Categories.#categoryList.splice(index, 1);
        return true
    }
}