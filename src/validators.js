import {isBefore, isValid} from 'date-fns';

export function validateTitle(title) {
    if(title === undefined || title === "") {
        throw new Error('title is required')
    } else if (title.length > 100) {
        throw new Error('maximum title length is 100 characters')
    }
    return title; 
}

export function validatePriority(priority) {
    const allowed = ['low', 'moderate', 'high'];
    if(!allowed.includes(priority)){
        throw new Error(`priority must be one of (${allowed.join(', ')})`)
    }
    return priority;
}

export function validateDesc(text) {
    if(text.length > 500) {
        throw new Error('maximum description length is 500 characters');
    }
    return text;
}

export function validateDue(endDate, startDate) {
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
