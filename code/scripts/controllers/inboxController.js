import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import Message from "../models/Message.js";
import Inbox from "../models/Inbox.js";
export default class inboxController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.setModel({});

        this.model.inbox = Inbox.getMessages();
        this.on("view-inbox-message", (event) => {
            let target = event.target;
            let targetLabel = target.getAttribute("label");
            const regex = /[\d]+/gm;
            const index = regex.exec(targetLabel);
            history.push({
                pathname: '/view-inbox-message',
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