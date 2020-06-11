import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import Message from "../models/Message.js";
import Organizations from "../models/Organizations.js";
import Contact from "../models/Contact.js";

const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';
export default class sendMessageController extends ContainerController{
    constructor(element, history) {
        super(element);
        this.setModel(new Message());

        this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
            this.profile = profile;
            let options = [];
            this.DSUStorage.getObject(`${STORAGE_LOCATION}${this.profile.id}/contacts.json`, (err, contacts) => {
                if (typeof contacts === "undefined") {
                    contacts = [];
                }
                this.contacts = contacts;
                contacts.forEach(contact => {
                    options.push(new Contact(contact).generateViewModel());
                });
            });

            this.model.contacts = {
                label: "To",
                placeholder: "Select a contact",
                options: options
            };
        });


        this.on("send-message", (event) => {
                let message = this.model;
                this.DSUStorage.getObject(`${STORAGE_LOCATION}${this.profile.id}/outbox.json`, (err, outbox) => {
                    if (typeof outbox === "undefined") {
                        outbox = [];
                    }
                    message.to = this.contacts.find(contact => contact.id === message.to);
                    console.log("message.to==============", message.to.logo);
                    outbox.push(message);
                    this.DSUStorage.setObject(`${STORAGE_LOCATION}${this.profile.id}/outbox.json`, outbox, (err) => {
                        history.push("/outbox");
                    });
                });
        });
    }
}