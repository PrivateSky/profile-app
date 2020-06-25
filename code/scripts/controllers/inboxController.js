import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import Outbox from "../models/Outbox.js";
const PROFILE_PATH = '/app/data/profile.json';
const CONTACTS_PATH = '/app/data/contacts.json';
const STORAGE_LOCATION = '/code/data/';
export default class inboxController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.setModel({inbox: []});
        this.model.addExpression('inboxLoaded', () => {
            return typeof this.model.inbox !== "undefined";
        }, 'inbox');

        this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
            this.profile = profile;
            const inboxPath = `/code/data/${profile.code}/inbox.json`;
            this.DSUStorage.getObject(inboxPath, (err, inbox) => {
                if (typeof inbox === "undefined") {
                    return this.model.inbox = [];
                }

                this.DSUStorage.getObject(CONTACTS_PATH, (err, contacts) => {
                    inbox.forEach(message => {
                        let contactCode = message.from;
                        for (let i = 0; i < contacts.length; i++) {
                            if (contacts[i].code === contactCode) {
                                message.from = contacts[i];
                                return;
                            }
                        }
                    });
                    this.model.inbox = inbox;
                });
            });
        });

        this.on("view-inbox-message", (event) => {
            let target = event.target;
            let targetLabel = target.getAttribute("label");
            const regex = /[\d]+/gm;
            const index = regex.exec(targetLabel);
            history.push({
                pathname: '/view-inbox-message',
                state: {
                    messageIndex: Array.isArray(index) ? index[0] : index
                }
            });
        }, {capture: true});

        this.on('openFeedback', (e) => {
            this.feedbackEmitter = e.detail;
        });
    }
};