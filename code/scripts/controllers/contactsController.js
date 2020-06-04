import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";

export default class contactsController extends ContainerController {
    constructor(element, history) {
        super(element);
        this.setModel({});

        if(typeof history.location.state !== "undefined"){
            this.profileID = history.location.state.profileID;
        }

        this.model.addExpression('contactsLoaded', () => {
            console.log("Expression checking", typeof this.model.contacts !== "undefined");
            return typeof this.model.contacts !== "undefined";
        }, 'contacts');

        this.model.contacts = [];
        this.DSUStorage.getObject(`/data/${this.profileID}/contacts.json`, (err, contactsHistory)=>{
            if(typeof contactsHistory === "undefined"){
                return this.model.contacts = [];
            }

            this.model.contacts = contactsHistory;
        });

        this.on("add-contact", (event)=>{
            history.push("/add-contact");
        });
    }
}