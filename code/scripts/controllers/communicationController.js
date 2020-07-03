import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Message from "../models/Message.js";

const CONTACTS_PATH = "/app/data/contacts.json";
export default class communicationController extends ContainerController {
    constructor(element, history) {
        super(element);

        window.addEventListener("send-leaflet", (event) => {
            let messageModel = event.data;
            let message = new Message(messageModel).getApprovalMessage(messageModel.leaflet);
            this.DSUStorage.getObject(CONTACTS_PATH, (err, contacts) => {
                //update the model with the contact object ref
                message.to = contacts.find(contact => contact.code === messageModel.target);
                message.from = messageModel.source;
                const inboxPath = `/code/data/${message.target}/inbox.json`;
                const outboxPath = `/code/data/${message.source}/outbox.json`;
                this.updateInbox(inboxPath, message, (err) => {
                    this.updateOutbox(outboxPath, message, (err) => {
                        window.dispatchEvent(new Event("leaflet-sent"));
                    });
                });
            });
        });
    }

    updateInbox(inboxPath, message, callback) {
        this.DSUStorage.getObject(inboxPath, (err, inbox) => {
            if (typeof inbox === "undefined") {
                inbox = [];
            }

            inbox.push(message);

            this.DSUStorage.setObject(inboxPath, inbox, (err) => {
                callback(err);
            });
        });
    }

    updateOutbox(outboxPath, message, callback) {
        this.DSUStorage.getObject(outboxPath, (err, outbox) => {
            if (typeof outbox === "undefined") {
                outbox = [];
            }

            outbox.push(message);

            this.DSUStorage.setObject(outboxPath, outbox, (err) => {
                callback(err);
            });
        });
    }
}