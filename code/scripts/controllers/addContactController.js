import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Contact from '../models/Contact.js';
import Countries from "../models/Countries.js";

const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';
const organizations = [
    {
        label: "Cantonal Agency of Control of pharmacentric products (ZH)",
        value: "Cantonal Agency of Control of pharmacentric products (ZH)"
    },
    {
        label: "National Medicine and Medication",
        value: "National Medicine and Medication"
    }
];

export default class addContactController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.setModel(new Contact());
        this.model.organizations = {
            label: "Organization",
            placeholder: "Select an organization",
            required: true,
            options: organizations
        };

        this.model.countries = {
            label: "Country",
            placeholder: "Select a country",
            required: true,
            options: Countries.getListAsVM()
        };
        this.on('openFeedback', (e) => {
            this.feedbackEmitter = e.detail;
        });

        const saveContact = (event) => {
            let contact = this.model;

            let validationResult = contact.validate();
            if (Array.isArray(validationResult)) {
                for (let i = 0; i < validationResult.length; i++) {
                    let err = validationResult[i];
                    this.showError(err);
                }
                return;
            }
            let contacts = [];

            const __updateContact = () => {
                this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
                    this.DSUStorage.getObject(`${STORAGE_LOCATION}${profile.id}/contacts.json`, (err, contactsHistory) => {
                        if (err) {

                        } else {
                            contacts = contactsHistory;
                        }


                        contact.country = Countries.getCountry(contact.country);
                        contacts.push(contact);
                        this.DSUStorage.setObject(`${STORAGE_LOCATION}${profile.id}/contacts.json`, contacts, (err) => {
                            history.push('/contacts');
                        });
                    });
                });
            };

            if (typeof this.logo !== "undefined") {
                this.DSUStorage.setItem(`/data/${contact.id}/image.png`, this.logo, (err, url) => {
                    if (err) {
                        throw err;
                    }
                    contact.logo = '/download' + url + '?' + Math.random();
                    __updateContact();
                });
            } else {
                __updateContact();
            }
        };
        this.on("save-contact", saveContact);

        this.on("update-logo", (event) => {
            this.logo = event.data;
        });
    }


    showError(err, title, type) {
        let errMessage;
        title = title ? title : 'Validation Error';
        type = type ? type : 'alert-danger';

        if (err instanceof Error) {
            errMessage = err.message;
        } else if (typeof err === 'object') {
            errMessage = err.toString();
        } else {
            errMessage = err;
        }
        this.feedbackEmitter(errMessage, title, type);
    }
}