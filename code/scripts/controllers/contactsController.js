import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
const CONTACTS_PATH = '/app/data/contacts.json';

export default class contactsController extends ContainerController {
    constructor(element, history) {
        super(element);
        this.setModel({});


        this.model.addExpression('contactsLoaded', () => {
            return typeof this.model.contacts !== "undefined";
        }, 'contacts');

        this.model.contacts = [];
        this.DSUStorage.getObject(CONTACTS_PATH, (err, contactsHistory) => {
            if (typeof contactsHistory === "undefined") {
                return this.model.contacts = []
            }

            this.model.contacts = contactsHistory;

        });

        this.on("add-contact", (event) => {
            history.push("/add-contact");
        });
    }
}