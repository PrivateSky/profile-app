import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import Message from "../models/Message.js";
import Profile from "../models/Profile.js";
import Outbox from "../models/Outbox.js";

const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';
const INBOX_PATH = `/app/data/inbox.json`;
const OUTBOX_PATH = `/app/data//outbox.json`;
export default class viewOutboxMessageController extends ContainerController {
    constructor(element, history) {
        super(element);
        this.setModel({});
        if (typeof history.location.state !== "undefined") {
            this.messageIndex = history.location.state.messageIndex;
        }


        if (typeof this.messageIndex !== "undefined") {
            this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
                this.profile = profile;
                this.DSUStorage.getObject(OUTBOX_PATH, (err, messages) => {
                    if (typeof messages === "undefined") {
                        this.model.message = new Message();
                    }
                    this.model.message = new Message(messages[this.messageIndex]);
                });
            });
        } else {
            this.model.message = new Message();
        }

        this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
            if (err) {
                profile = new Profile();
            } else {
                profile = new Profile(profile);
            }

            this.model.profile = profile
        });
    }
};