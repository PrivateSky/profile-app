import Contact from "./Contact.js";
const contacts = [
    {
        organization: "Food and Drug Administration",
        logo: "/assets/images/fda-logo.jpg",
        country: "United-States"
    },
    {
        organization: "National Institute of Health",
        logo: "/assets/images/nih-logo.png",
        country: "United-Kingdom"
    }];
export default {
    getContacts(){
        const contactList = [];
        contacts.forEach(contact => {
            contactList.push(new Contact(contact));
        });

        return contactList;
    }
}