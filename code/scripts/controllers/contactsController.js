import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';
export default class contactsController extends ContainerController {
    constructor(element, history) {
        super(element);
        this.setModel({});


        this.model.addExpression('contactsLoaded', () => {
            return typeof this.model.contacts !== "undefined";
        }, 'contacts');

        this.model.contacts = [];
        this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
            this.DSUStorage.getObject(`${STORAGE_LOCATION}${profile.id}/contacts.json`, (err, contactsHistory) => {
                if (typeof contactsHistory === "undefined") {
                    return this.model.contacts = [];
                }

                this.model.contacts = contactsHistory;
            });
        });
        this.on("add-contact", (event) => {
            history.push("/add-contact");
        });
    }
}