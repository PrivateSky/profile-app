import Message from "./Message.js";

const messages = [
    {
        to: {
            organization: "Food and Drug Administration",
            logo: "/assets/images/fda-logo.jpg"
        },
        subject: "Xanax approval request",
        content: "Xanax approval request content..."
    },
    {
        to: {
            organization: "National Institute of Health",
            logo: "/assets/images/nih-logo.png"
        },
        subject: "Albuferol approval request",
        content: "Albuferol approval request content..."
    }];
export default {
    getMessages() {
        const outbox = [];
        messages.forEach(message => {
            outbox.push(new Message(message));
        });

        return outbox;
    }
}