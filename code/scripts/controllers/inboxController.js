import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import Message from "../models/Message.js";

const messages = [
    {
        from: {
            organization: "National Institute of Health",
            logo: "/assets/images/nih-logo.png"
        },
        subject: "Albuferol approval",
        content: "Albuferol approval message content..."
    },
    {
        from: {
            organization: "Food and Drug Administration",
            logo: "/assets/images/fda-logo.jpg"
        },
        subject: "Xanax approval",
        content: "Xanax approval message content..."
    }
];
export default class inboxController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.setModel({inbox: []});
        this.model.addExpression('inboxLoaded', () => {
            return typeof this.model.inbox !== "undefined";
        }, 'inbox');
        for (let i = 0; i < messages.length; i++) {
            this.model.inbox.push(new Message(messages[i]));
        }

        this.on('openFeedback', (e) => {
            this.feedbackEmitter = e.detail;
        });
    }
};