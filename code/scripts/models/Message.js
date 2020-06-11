import Utils from "./Utils.js";

export default class Message{
    id;
    subject;
    to;
    from;
    content;
    constructor(message) {
        if(typeof message !== undefined){
            for(let prop in message){
                this[prop] = message[prop];
            }
        }

        if (typeof this.id === "undefined") {
            this.id = Utils.generateID(32);
        }
    }


}