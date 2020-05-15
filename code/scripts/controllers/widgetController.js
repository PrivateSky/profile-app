import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Profile from './../models/Profile.js';
import ProfileManager from './../services/ProfileManager.js';

export default class widgetController extends ContainerController {

	viewModel = {};

	constructor(element, history) {
		super(element);

		this.model = this.setModel(this.viewModel);
		this.refreshProfile();

		setInterval(()=>{
			this.refreshProfile();
		}, 2000);
	}

	refreshProfile(){
		ProfileManager.get((err, profile)=>{
			if(err){
				profile = new Profile();
			}
console.log("Hereeeeee");
			this.model.data = {
				username: profile.name,
				avatar: profile.avatar,
				email: profile.email
			};
		});
	}
}