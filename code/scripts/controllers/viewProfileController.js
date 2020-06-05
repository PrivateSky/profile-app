import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Profile from './../models/Profile.js';
const PROFILE_PATH = '/app/data/profile.json';
export default class viewProfileController extends ContainerController {

    constructor(element, history) {
        super(element);

        this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
            if (err) {
                profile = new Profile();
            } else {
                profile = new Profile(profile);
            }

            this.model = this.setModel(profile);
        });

        this.on("edit-profile", (event) => {
            history.push("/edit");
        });
    }
}
