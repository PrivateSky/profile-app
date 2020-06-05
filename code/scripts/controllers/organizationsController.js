import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';
export default class organizationsController extends ContainerController {
    constructor(element, history) {
        super(element);
        this.setModel({});


        this.model.addExpression('organizationsLoaded', () => {
            return typeof this.model.organizations !== "undefined";
        }, 'organizations');

        this.model.organizations= [];
        this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
            this.DSUStorage.getObject(`${STORAGE_LOCATION}${profile.id}/organizations.json`, (err, organizationsHistory) => {
                if (typeof organizationsHistory === "undefined") {
                    return this.model.organizations = [];
                }

                this.model.organizations = organizationsHistory;
            });
        });
        this.on("add-organization", (event) => {
            history.push("/add-organization");
        });
    }
}