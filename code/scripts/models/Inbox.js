import Message from "./Message.js";
const messages = [
    {
        from: {
            name: "National Institute of Health",
            logo: "/assets/images/nih-logo.png"
        },
        subject: "Albuferol approval",
        content: "Albuferol approval message content..."
    },
    {
        from: {
            name: "Food and Drug Administration",
            logo: "/assets/images/fda-logo.jpg"
        },
        subject: "Xanax approval",
        content: "Xanax approval message content..."
    }
];
export default {
    getMessages(){
        const inbox = [];
        messages.forEach(message => {
            inbox.push(new Message(message));
        });

        return inbox;
    }
}