import Utils from "./Utils.js";

export default class Organization {
    id;
    name = 'Cantonal Agency of Control of pharmacentric products (ZH)';
    country = 'Switzerland';


    constructor(organization) {
        if (typeof organization !== undefined) {
            for (let prop in organization) {
                this[prop] = organization[prop];
            }
        }

        if (typeof this.id === "undefined") {
            this.id = Utils.generateID(32);
        }
    }

    generateViewModel() {
        return {
            label: this.name,
            value: this.id
        }
    }

    validate() {
        const errors = [];
        if (!this.name) {
            errors.push('Name is required.');
        }

        if (!this.country) {
            errors.push('OrganizationID is required.');
        }

        return errors.length === 0 ? true : errors;
    }
};