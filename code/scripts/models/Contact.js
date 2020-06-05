import Utils from "./Utils.js";
export default class Contact {
    name = '';
    organizationID;
    constructor(contact) {
        if(typeof contact !== undefined){
            for(let prop in contact){
                this[prop] = contact[prop];
            }
        }

        this.id = Utils.generateID(32);
    }

    validate(){
        const errors = [];
        if (!this.name) {
            errors.push('Name is required.');
        }

        return errors.length === 0 ? true : errors;
    }
}