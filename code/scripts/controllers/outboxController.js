import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";

const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';

export default class outboxController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.setModel({});
        this.model.addExpression('outboxLoaded', () => {
            return typeof this.model.outbox !== "undefined";
        }, 'outbox');

        this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
            this.profile = profile;
            this.DSUStorage.getObject(`${STORAGE_LOCATION}${this.profile.id}/outbox.json`, (err, outbox) => {
                if (typeof outbox === "undefined") {
                    return this.model.outbox = [];
                }

                this.model.outbox = outbox;
            });
        });


        this.on("send-message", (event) => {
            history.push("/send-message");
        });
    }
};