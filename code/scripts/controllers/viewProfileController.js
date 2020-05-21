import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Profile from './../models/Profile.js';

export default class viewProfileController extends ContainerController {

	constructor(element, history) {
		super(element);

		this.requestManager.download("/data/profile.json", "json", (err, profile)=>{
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
			const queryString = `path=/data&filename=${file.name}&maxSize=16m&allowedTypes=image/jpeg,image/png,image/gif`;
			this.requestManager.upload(queryString, file, (err, url) => {
				if(err){
					throw err;
				}
				this.model.avatar = '/download'+url;
				const queryString = 'path=/data&filename=profile.json';
				this.requestManager.upload(queryString, JSON.stringify(this.model), (err)=>{
					if(err){
						throw err;
					}
				});
			});
		});
	}
}