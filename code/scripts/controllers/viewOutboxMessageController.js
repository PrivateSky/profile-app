import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import Message from "../models/Message.js";
import Profile from "../models/Profile.js";
import MessageDisplayer from "../services/MessageDisplayer.js";

const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';
export default class viewOutboxMessageController extends ContainerController {
    constructor(element, history) {
        super(element);
        this.setModel({});
        if (typeof history.location.state !== "undefined") {
            this.messageIndex = history.location.state.messageIndex;
        }

        this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
            if (err) {
                profile = new Profile();
            } else {
                profile = new Profile(profile);
            }

            this.model.profile = profile;
            if (typeof this.messageIndex !== "undefined") {
                const outboxPath = `/code/data/${this.model.profile.code}/outbox.json`;
                this.DSUStorage.getObject(outboxPath, (err, messages) => {
                    if (typeof messages === "undefined") {
                        this.model.message = new Message();
                    }
                    this.model.message = new Message(messages[this.messageIndex]);
                    MessageDisplayer.displayMessage(this.model.message, element);
                });
            } else {
                this.model.message = new Message();
                MessageDisplayer.displayMessage(this.model.message, element);
            }
        });
    }
};
