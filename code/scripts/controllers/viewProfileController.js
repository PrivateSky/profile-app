import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Profile from './../models/Profile.js';
import ProfileManager from './../services/ProfileManager.js';

export default class viewProfileController extends ContainerController {

	viewModel = {
		editBtn: {
			label: "Edit Profile",
			eventName: "edit-profile"
		},
		labels:{
			name: "Name",
			phone: "Phone",
			email: "Email",
			birthday: "Birthday",
			address: "Address",
			code: "Code"
		}
	};

	constructor(element, history) {
		super(element);
		console.log("here i'm...");

		this.model = this.setModel(this.viewModel);
		ProfileManager.get((err, profile)=>{
			if(err){
				profile = new Profile();
			}else{
				profile = new Profile(profile);
			}

			this.model.data = profile;
		});

		this.on("edit-profile", (event)=>{
			history.push("/edit");
		});
	}
}