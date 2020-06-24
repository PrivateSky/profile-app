import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import Outbox from "../models/Outbox.js";
const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';
const OUTBOX_PATH = `/app/data//outbox.json`;

export default class outboxController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.setModel({outbox: []});
        this.model.addExpression('outboxLoaded', () => {
            return typeof this.model.outbox !== "undefined";
        }, 'outbox');

        this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
            this.profile = profile;
            this.DSUStorage.getObject(OUTBOX_PATH, (err, outbox) => {
                if (typeof outbox === "undefined") {
                    return this.model.outbox = [];
                }

                this.model.outbox = outbox;
            });
        });

        this.on("view-outbox-message", (event) => {
            let target = event.target;
            let targetLabel = target.getAttribute("label");
            const regex = /[\d]+/gm;
            const index = regex.exec(targetLabel);
            history.push({
                pathname: '/view-outbox-message',
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