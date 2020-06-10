import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Utils from "../models/Utils.js";

const PROFILE_PATH = '/app/data/profile.json';
const STORAGE_LOCATION = '/code/data/';

export default class scanCodeController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.setModel({});
        this.model.code = 'assets/images/code.png';

        this.on('enter-code', (event) => {
            this.DSUStorage.getObject(PROFILE_PATH, (err, profile) => {
                this.DSUStorage.getObject(`${STORAGE_LOCATION}${profile.id}/contact.json`, (err, contact) => {
                    contact.code = Utils.generateID(12);
                    this.DSUStorage.setObject(`${STORAGE_LOCATION}${profile.id}/contact.json`, contact,(err) => {
                        history.push('/add-contact');
                    });
                });
            });
        });
    }
}