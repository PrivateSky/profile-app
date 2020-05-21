import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Profile from './../models/Profile.js';

export default class editProfileController extends ContainerController {

	buildViewModel(profile){
		this.model = this.setModel(profile);
	}

	extractProfile(data){
		return data;
	}

	constructor(element, history) {
		super(element);

		this.requestManager.download("/data/profile.json",  "json", (err, profile)=>{
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

			this.requestManager.upload('path=/data&filename=profile.json', JSON.stringify(profile), (err)=>{
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