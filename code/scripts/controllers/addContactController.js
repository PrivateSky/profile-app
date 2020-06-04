import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Contact from '../models/Contact.js';

function generateID(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default class addContactController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.setModel(new Contact());

        this.on('openFeedback', (e) => {
            this.feedbackEmitter = e.detail;
        });

        this.on("save-contact", (event) => {
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
            if (typeof this.profileID === "undefined") {
                this.profileID = generateID(10);
            }
            this.DSUStorage.getObject(`/data/${this.profileID}/contacts.json`, (err, contactsHistory) => {
                if (err) {

                } else {
                    contacts = contactsHistory;
                }

                contacts.push(contact);
                this.DSUStorage.setObject(`/data/${this.profileID}/contacts.json`, contacts, (err) => {
                    if (err) {
                        throw err;
                    }

                    history.push({
                        pathname: '/contacts',
                        state: {
                            profileID: this.profileID
                        }
                    });
                });
            });
        });
    }
}