import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Profile from './../models/Profile.js';
import ProfileManager from './../services/ProfileManager.js';

export default class viewProfileController extends ContainerController {

	constructor(element, history) {
		super(element);

		ProfileManager.get((err, profile)=>{
			if(err){
				profile = new Profile();
			}else{
				profile = new Profile(profile);
			}

			this.model = this.setModel(profile);
		});

		this.on("edit-profile", (event)=>{
			history.push("/edit");
		});

		this.on("update-avatar", (event)=>{
			console.log("Updating avatar");
			ProfileManager.uploadAvatar(event.data[0], (err, url) => {
				if(err){
					throw err;
				}
				this.model.avatar = url;
				ProfileManager.update(this.model, (err)=>{
					if(err){
						throw err;
					}
				});
				console.log(url);
			});
		});
	}
}