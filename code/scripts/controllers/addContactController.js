import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Contact from '../models/Contact.js';
import Countries from "../models/Countries.js";
import Contacts from "../models/Contacts.js";

const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';

export default class addContactController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
            this.profile = profile;
            this.DSUStorage.getObject(`${STORAGE_LOCATION}${this.profile.id}/contact.json`, (err, contact) => {
                if (err || contact === {}) {
                    contact = new Contact();
                } else {
                    contact = new Contact(contact);
                }

                this.setModel(contact);

                this.model.countries = {
                    label: "Country",
                    placeholder: "Select a country",
                    options: Countries.getListAsVM()
                };

                if (typeof this.model.country !== "undefined") {
                    this.model.countries.placeholder = Countries.getCountry(this.model.country);
                }

            });
        });

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

            this.DSUStorage.getObject(`${STORAGE_LOCATION}${this.profile.id}/contacts.json`, (err, contactsHistory) => {
                if (typeof contactsHistory === "undefined") {
                    contacts = Contacts.getContacts();
                } else {
                    contacts = contactsHistory;
                }

                contact.country = Countries.getCountry(contact.country);
                contacts.push(contact);
                console.log("Just added contact +++++++++++++++++++", contacts);
                this.DSUStorage.setObject(`${STORAGE_LOCATION}${this.profile.id}/contacts.json`, contacts, (err) => {
                    this.DSUStorage.setObject(`${STORAGE_LOCATION}${this.profile.id}/contact.json`, {}, (err) => {
                        history.push('/contacts');
                    });
                });
            });
        };
        this.on("save-contact", saveContact);

        this.on("update-logo", (event) => {
            const logo = event.data;

            this.DSUStorage.setItem(`/data/${this.model.id}/image.png`, logo, (err, url) => {
                if (err) {
                    throw err;
                }
                this.model.logo = '/download' + url;
            });
        });

        this.on("scan-code", (event) => {
            this.DSUStorage.setObject(`${STORAGE_LOCATION}${this.profile.id}/contact.json`, this.model, (err) => {
                history.push('/scan-code');
            });
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