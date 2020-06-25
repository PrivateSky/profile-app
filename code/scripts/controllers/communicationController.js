import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Message from "../models/Message.js";

const CONTACTS_PATH = "/app/data/contacts.json";
export default class communicationController extends ContainerController {
    constructor(element, history) {
        super(element);

        window.addEventListener("send-leaflet", (event) => {
            const leaflet = event.data.leaflet;
            const source = event.data.source;
            const leafletSEED = event.data.leafletSEED;
            const message = new Message().getApprovalMessage(leaflet);
            this.DSUStorage.getObject(CONTACTS_PATH, (err, contacts) => {
                message.to = contacts.find(contact => contact.code === leaflet.healthAuthority);
                message.from = source;
                message.dsu = leafletSEED;
                const inboxPath = `/code/data/${leaflet.healthAuthority}/inbox.json`;
                const outboxPath = `/code/data/${source}/outbox.json`;
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