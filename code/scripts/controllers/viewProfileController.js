import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Profile from './../models/Profile.js';

export default class viewProfileController extends ContainerController {

	constructor(element, history) {
		super(element);

		this.storage.getData("/data/profile.json", "json", (err, profile)=>{
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

			const file = event.data[0];
			this.storage.storeData(`/data/avatars/${file.name}`, file, (err, url) => {
				if(err){
					throw err;
				}
				this.model.avatar = '/download'+url;
				this.requestManager.storeData("/data/profile.json", JSON.stringify(this.model), (err)=>{
					if(err){
						throw err;
					}
				});
			});
		});
	}
}