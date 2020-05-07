import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import ProfileModel from './../models/ProfileModel.js';

export default class ProfileController extends ContainerController {

    constructor(element, history) {
        super(element);
        this.history = history;
        this.feedbackEmitter = null;
        this.profileModel = new ProfileModel();
        this.model = this.setModel(this.profileModel.toJSON());
        this.profileModel.hydrate(this.model).then(() => {
            const isHomepage = window.location.search.indexOf('home') !== -1;

            if (!this.model.name && isHomepage) {
                return this.history.push('/edit');
            }
        })

        this.avatarFile = null;

        this.on('openFeedback', (e) => {
            this.feedbackEmitter = e.detail;
        });

        this.on('profile:choose-avatar', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            this._setAvatar(e.data);
        })

        this.on('profile:upload-avatar', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            this._uploadAvatar();
        })

        this.on('profile:save', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            this._saveProfile();
        })
    }

    /**
     * Show the list of selected files
     * @param {Array} files
     */
    _setAvatar(files) {
        // Render the list of files
        const filesList = this.element.querySelector('#files-for-upload');
        filesList.innerHTML = '';

        for (const f of files) {
            const listItem = document.createElement('li');
            listItem.innerText = f.name;

            filesList.appendChild(listItem);
            this.avatarFile = f;
            break;
        }
    }

    _uploadAvatar() {
        const file = this.avatarFile;
        this.profileModel.updateAvatar(file).catch((err) => {
            if (Array.isArray(err)) {
                let errStr = '';
                for (const e of err) {
                    errStr += e + " ";
                }
                this.showError(errStr);
                return;
            }

            this.showError(err.message || err);
        });
    }

    _saveProfile() {
        this.profileModel.save(this.model)
            .then((result) => {
                this.history.push('/home');
            })
            .catch((err) => {
                if (Array.isArray(err)) {
                    let errStr = '';
                    for (const e of err) {
                        errStr += e + " ";
                    }
                    this.showError(errStr);
                    return;
                }

                this.showError(err.message || err);
            });
    }

    /**
     * Show an error alert
     * @param {Error|object|string} err
     */
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
