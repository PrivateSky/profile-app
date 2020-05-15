import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Profile from './../models/Profile.js';
import ProfileManager from './../services/ProfileManager.js';

export default class editProfileController extends ContainerController {

	viewModel = {
		saveBtn: {
			label: "Save",
			eventName: "save-profile"
		},
		cancelBtn: {
			label: "Cancel",
			eventName: "cancel"
		},
		form:{
			name: "Name",
			phone: "Phone",
			email: "Email",
			birthday: "Birthday",
			address: "Address",
			code: "Code"
		},
		data:{}
	};

	buildViewModel(profile){
		let data = {};
		for(let prop in profile){
			data[prop] = {
				value: profile[prop]
			}
		}
		this.model.data = data;
	}

	extractProfile(data){
		let profile = new Profile();
		for(let prop in data){
			profile[prop] = data[prop].value;
		}
		return profile;
	}

	constructor(element, history) {
		super(element);

		this.model = this.setModel(this.viewModel);
		console.log("Editing...");
		ProfileManager.get((err, profile)=>{
			if(err){
				profile = new Profile();
			}else{
				profile = new Profile(profile);
			}

			//this.model.data = profile;
			this.buildViewModel(profile);
		});

		this.on('openFeedback', (e) => {
			this.feedbackEmitter = e.detail;
		});

		this.on("cancel", (event)=>{
			history.push("/home");
		});

		this.on("save-profile", (event)=>{
			console.log("Start saving");
			let profile = this.extractProfile(this.model.data);
			let validationResult = profile.validate();
			if(Array.isArray(validationResult)){
				for(let i = 0; i<validationResult.length; i++){
					let err = validationResult[i];
					this.showError(err);
				}
				return;
			}

			ProfileManager.update(profile, (err)=>{
				if(err){
					this.showError(err, "Profile update failed.");
					return;
				}
				history.push("/home");
			});
		});
	}

	showError(err, title, type) {
		let errMessage;
		title = title ? title : 'Validation Error';
		type = type ? type : 'alert-danger';

		if (err instanceof Error) {
			errMessage = err.message;
		} else if (typeof err === 'object') {
			errMessage = err.toString();
		} else {
			errMessage = err;
		}
		this.feedbackEmitter(errMessage, title, type);
	}
}