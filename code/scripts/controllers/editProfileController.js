import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Profile from './../models/Profile.js';
import ProfileManager from './../services/ProfileManager.js';

export default class editProfileController extends ContainerController {

	buildViewModel(profile){
		/*let data = {};
		for(let prop in profile){
			data[prop] = {
				value: profile[prop]
			}
		}
		this.model = this.setModel(data);*/
		this.model = this.setModel(profile);
	}

	extractProfile(data){
		/*let profile = new Profile();
		for(let prop in data){
			profile[prop] = data[prop].value;
		}
		return profile;*/
		return data;
	}

	constructor(element, history) {
		super(element);

		ProfileManager.get((err, profile)=>{
			if(err){
				profile = new Profile();
			}else{
				profile = new Profile(profile);
			}

			this.buildViewModel(profile);
		});

		this.on('openFeedback', (e) => {
			this.feedbackEmitter = e.detail;
		});

		this.on("cancel", (event)=>{
			history.push("/home");
		});

		this.on("save-profile", (event)=>{
			debugger
			let profile = this.extractProfile(this.model);
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