import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Profile from './../models/Profile.js';

export default class widgetController extends ContainerController {

	constructor(element, history) {
		super(element);
		this.model = this.setModel({});
		this.refreshProfile();

		setInterval(() => {
			this.refreshProfile();
		}, 2000);
	}

	refreshProfile() {
		this.storage.getData("/data/profile.json", "json", (err, profile) => {
			if (err) {
				profile = new Profile();
			}

			this.model.profile = {
				username: profile.name,
				avatar: profile.avatar,
				email: profile.email
			};
		});
	}
}