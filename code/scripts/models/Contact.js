import Utils from "./Utils.js";

export default class Contact {
    logo = '/assets/images/default-logo.png';
    name;
    country;

    constructor(contact) {
        if (typeof contact !== undefined) {
            for (let prop in contact) {
                this[prop] = contact[prop];
            }
        }

        if (typeof this.id === "undefined") {
            this.id = Utils.generateID(32);
        }
    }

    validate() {
        const errors = [];
        if (!this.name) {
            errors.push('Organization is required.');
        }

        if (!this.country) {
            errors.push('Country is required.');
        }

        return errors.length === 0 ? true : errors;
    }

    generateViewModel() {
        return {label: this.name, value: this.id};
    }
}