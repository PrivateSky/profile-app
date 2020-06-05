import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Organization from '../models/Organization.js';

const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';
export default class addOrganizationsController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.setModel(new Organization());
        
        this.on('openFeedback', (e) => {
            this.feedbackEmitter = e.detail;
        });

        const saveOrganization = (event) =>  {
            let organization = this.model;
            let validationResult = organization.validate();
            if (Array.isArray(validationResult)) {
                for (let i = 0; i < validationResult.length; i++) {
                    let err = validationResult[i];
                    this.showError(err);
                }
                return;
            }
            let organizations = [];
            this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
                this.DSUStorage.getObject(`${STORAGE_LOCATION}${profile.id}/organizations.json`, (err, organizationsHistory) => {
                    if (err) {

                    } else {
                        organizations = organizationsHistory;
                    }

                    organizations.push(organization);
                    this.DSUStorage.setObject(`${STORAGE_LOCATION}${profile.id}/organizations.json`, organizations, (err) => {
                        history.push('/organizations');
                    });
                });
            });
        };

        this.on("save-organization", saveOrganization);
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