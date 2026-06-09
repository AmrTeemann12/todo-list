import {isBefore, isValid} from 'date-fns';

export const todoValidate = {
    title(title) {
        if(title === undefined || title === "") {
            throw new Error('title is required')
        } else if (title.length > 100) {
            throw new Error('maximum title length is 100 characters')
        }
        return title; 
    },
    priority(priority, defaultPriority = 'moderate') {
        const allowed = ['low', 'moderate', 'high'];
        if(!allowed.includes(priority)){
            console.warn(`priority must be one of (${allowed.join(', ')})`)
            return defaultPriority;
        }
        return priority;
    },
    desc(text) {
        if(text.length > 500) {
            console.warn('maximum description length is 500 characters');
            return text.slice(0,500);
        }
        return text;
    },
    due(endDate = null, startDate = new Date()) {
        if(endDate !== null){
            if(!isValid(endDate)) {
                throw new Error('due date is invalid');
            }
            if(isBefore(endDate, startDate)) {
                throw new Error('due date can\'t be before creation date');
            }
        }
        return endDate;
    }
};