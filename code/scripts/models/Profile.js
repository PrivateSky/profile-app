import Utils from "./Utils.js";
export default class Profile {
	avatar = "/assets/images/default-avatar.png";
	name = "John Led";
	phone = "+34 684 24 84 63";
	email = "john.led@jhon.es";
	birthday = "15/03/1986";
	address = "Madrid";
	code = "MDVMEB30409JN3GB";

	constructor(profile) {
		if(typeof profile !== undefined){
			for(let prop in profile){
				this[prop] = profile[prop];
			}
		}

		if (typeof this.id === "undefined") {
			this.id = Utils.generateID(16);
		}
	}

	validate(){
		const errors = [];
		if (!this.name) {
			errors.push('Name is required.');
		}

		if (!this.email) {
			errors.push('Email is required.');
		}

		if (!this.phone) {
			errors.push('Phone is required.');
		}

		return errors.length === 0 ? true : errors;
	}
}