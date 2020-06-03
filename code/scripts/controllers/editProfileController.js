import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Profile from './../models/Profile.js';

export default class editProfileController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.DSUStorage.getObject("/data/profile.json", (err, profile) => {
            if (err) {
                profile = new Profile();
            } else {
                profile = new Profile(profile);
            }

            this.setModel(profile);
        });

        this.on('openFeedback', (e) => {
            this.feedbackEmitter = e.detail;
        });

        this.on("cancel", (event) => {
            history.push("/home");
        });

        this.on("update-avatar", (event) => {
            this.avatar = event.data;
        });

        this.on("save-profile", (event) => {
            let profile = this.model;
            let validationResult = profile.validate();
            if (Array.isArray(validationResult)) {
                for (let i = 0; i < validationResult.length; i++) {
                    let err = validationResult[i];
                    this.showError(err);
                }

                return;
            }

            const __updateProfile = () => {
                this.DSUStorage.setObject("/data/profile.json", profile, (err) => {
                    if (err) {
                        this.showError(err, "Profile update failed.");
                        return;
                    }

                    history.push("/home");
                });
            };


            if (typeof this.avatar !== "undefined") {
                this.DSUStorage.setItem(`/data/avatars/image.png`, this.avatar, (err, url) => {
                    if (err) {
                        throw err;
                    }
                    profile.avatar = '/download' + url;
                    __updateProfile();
                });
            } else {
                __updateProfile();
            }
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
