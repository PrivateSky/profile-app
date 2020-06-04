function generateID(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export default class Contact {
    name = '';
    organizationID = '';
    constructor(contact) {
        if(typeof contact !== undefined){
            for(let prop in contact){
                this[prop] = contact[prop];
            }
        }

        this.id = generateID(32);
    }

    validate(){
        const errors = [];
        if (!this.name) {
            errors.push('Name is required.');
        }

        if (!this.organizationID) {
            errors.push('OrganizationID is required.');
        }

        return errors.length === 0 ? true : errors;
    }
}