export default class ProfileModel {

    constructor() {
        this.data = {
            avatarUrl: '/assets/images/default-avatar.png',
            name: 'John Led',
            phone: '+34 684 24 84 63',
            email: 'john.led@jhon.es',
            birthday: '15/03/1986',
            address: 'Madrid',
            code: 'MDVMEB30409JN3GB',
            _name: {
                label: 'Name',
                name: 'name',
                value: "John Led"
            },
            _email: {
                label: 'Email',
                name: 'email',
                value: "john.led@john.es"
            },
            _phone: {
                label: 'Phone',
                name: 'phone',
                value: "+34 684 24 84 63"
            },
            _birthday: {
                label: 'Birthday',
                name: 'birthday',
                value: "15/03/1986"
            },
            _address: {
                label: 'Address',
                name: 'address',
                value: "Madrid"
            },
            _code: {
                label: 'Code',
                name: 'code',
                value: "MDVMEB30409JN3GB"
            }
        };
        this.cardinalModel = null;
    }

    hydrate(model) {
        this.cardinalModel = model;
        return fetch('/download/data/profile.json')
            .then((response) => {
                if (!response.ok) {
                    return;
                }

                return response.json().then((data) => {
                    model.name = data.name;
                    model.phone = data.phone;
                    model.email = data.email;
                    model.birthday = data.birthday;
                    model.address = data.address;
                    model.code = data.code;

                    model._name.value = model.name;
                    model._email.value = model.email;
                    model._phone.value = model.phone;
                    model._birthday.value = model.birthday;
                    model._address.value = model.address;
                    model._code.value = model.code;
                })
            })
            .catch((err) => {
                console.error(err);
            })

    }

    getJsonResponseBody(response) {
        return response.json((result) => {
            return result;
        }).catch((err) => {
            return Promise.resolve({});
        })
    };


    updateAvatar(file) {
        if (!file) {
            return Promise.reject('Please select an image before uploading.');
        }

        // Upload endpoint
        const url = `/upload?path=/data&filename=${file.name}&maxSize=16m&allowedTypes=image/jpeg,image/png,image/gif`;

        // Send the request
        return fetch(url, {
            method: 'POST',
            body: file
        }).then((response) => {
            return this.getJsonResponseBody(response).then((data) => {
                if (!response.ok || response.status != 201) {
                    let errorMessage = '';
                    if (Array.isArray(data) && data.length) {
                        errorMessage = `${data[0].error.message}. Code: ${data[0].error.code}`;
                    } else if (typeof data === 'object') {
                        errorMessage = data.message ? data.message : JSON.stringify(data);
                    }
                    return Promise.reject(new Error(`Unable to update avatar. ${errorMessage}`));
                }

                if (Array.isArray(data)) {
                    for (const item of data) {
                        if (item.error) {
                            return Promise.reject(new Error(`Unable to upload ${item.file.name} due to an error. Code: ${item.error.code}. Message: ${item.error.message}`));
                        }

                        console.log(`Uploaded ${item.file.name} to ${item.result.path}`);
                        const newAvatarUrl = '/download' + item.result.path;
                        if (this.cardinalModel) {
                            this.cardinalModel.avatarUrl = newAvatarUrl;
                        }

                        return Promise.resolve(newAvatarUrl);
                    }
                }
            });
        })
    }

    save(data) {
        const errors = [];
        if (!data._name.value) {
            errors.push('Name is required.');
        }

        if (!data._email.value) {
            errors.push('Email is required.')
        }

        if (!data._phone.value) {
            errors.push('Phone is required.')
        }

        if (errors.length) {
            return Promise.reject(errors);
        }

        this.data.name = data._name.value;
        this.data.email = data._email.value;
        this.data.phone = data._phone.value;
        this.data.birthday = data._birthday.value;
        this.data.address = data._address.value;
        this.data.code = data._code.value;

        const profileFile = new File([JSON.stringify(this.data)], "profile.json");

        const url = `/upload?path=/data&filename=${profileFile.name}`;

        return fetch(url, {
            method: 'POST',
            body: profileFile
        }).then((response) => {
            return this.getJsonResponseBody(response).then((data) => {
                if (!response.ok || response.status != 201) {
                    let errorMessage = '';
                    if (Array.isArray(data) && data.length) {
                        errorMessage = `${data[0].error.message}. Code: ${data[0].error.code}`;
                    } else {
                        errorMessage = data.message ? data.message : JSON.stringify(data);
                    }
                    return Promise.reject(new Error(`Unable to save profile. ${errorMessage}`));
                }

                if (Array.isArray(data)) {
                    for (const item of data) {
                        if (item.error) {
                            return Promise.reject(new Error(`Unable to upload ${item.file.name} due to an error. Code: ${item.error.code}. Message: ${item.error.message}`));
                        }
                    }
                }
            });
        });
    }

    toJSON() {
        return this.data;
    }
}
