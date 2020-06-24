import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Message from "../models/Message.js";

const CONTACTS_PATH = "/app/data/contacts.json";
const INBOX_PATH = `/app/data/inbox.json`;
const OUTBOX_PATH = `/app/data//outbox.json`;
export default class communicationController extends ContainerController {
    constructor(element, history) {
        super(element);

        window.addEventListener("send-leaflet", (event) => {
            const leaflet = event.data.leaflet;
            const source = event.data.source;

            const message = new Message().getApprovalMessage(leaflet);
            this.DSUStorage.getObject(CONTACTS_PATH, (err, contacts) => {
                message.to = contacts.find(contact => contact.code === leaflet.healthAuthority);
                this.updateInbox(INBOX_PATH, message, (err) => {
                    this.updateOutbox(OUTBOX_PATH, message, (err) => {
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