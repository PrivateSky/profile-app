export default class Message {
    shortHtml;
    longHtml;
    title;
    dsu;
    to;
    from;

    constructor(message) {
        if (typeof message !== undefined) {
            for (let prop in message) {
                this[prop] = message[prop];
            }
        }
    }

    getApprovalMessage(leaflet) {
        this.title = `${leaflet.name} approval request`;
        this.shortHtml = `Approval message for ${leaflet.name}`;
        this.longHtml = `<div> Approval message for ${leaflet.name} <iframe src=${leaflet.attachment}></iframe></div>`;
        this.to = leaflet.healthAuthority;
        return this;
    }
}