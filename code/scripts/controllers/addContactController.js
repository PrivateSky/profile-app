import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Contact from '../models/Contact.js';
import Organization from '../models/Organization.js';

const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';
export default class addContactController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.setModel(new Contact());

        this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
            this.DSUStorage.getObject(`${STORAGE_LOCATION}${profile.id}/organizations.json`, (err, organizations) => {
                this.model.organization = {
                    label: "Select an organization",
                    placeholder: "Please select one option...",
                    required: true,
                    options: []
                };
                organizations.forEach(organization => {
                    const org = new Organization(organization);
                    this.model.organization.options.push(org.generateViewModel());
                });

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
            this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
                this.DSUStorage.getObject(`${STORAGE_LOCATION}${profile.id}/contacts.json`, (err, contactsHistory) => {
                    if (err) {

                    } else {
                        contacts = contactsHistory;
                    }

                    contacts.push(contact);
                    this.DSUStorage.setObject(`${STORAGE_LOCATION}${profile.id}/contacts.json`, contacts, (err) => {
                        history.push('/contacts');
                    });
                });
            });
        };
        this.on("save-contact", saveContact);
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