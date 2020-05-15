class RequestManager {
	constructor() {

	}

	upload(url, data, callback){
		return fetch(url, {
			method: 'POST',
			body: data
		}).then((response) => {
			return this.getJsonResponseBody(response).then((data) => {
				if (!response.ok || response.status != 201) {
					let errorMessage = '';
					if (Array.isArray(data) && data.length) {
						errorMessage = `${data[0].error.message}. Code: ${data[0].error.code}`;
					} else if (typeof data === 'object') {
						errorMessage = data.message ? data.message : JSON.stringify(data);
					}
					throw new Error(`Upload request failed. ${errorMessage}`);
				}

				if (Array.isArray(data)) {
					for (const item of data) {
						if (item.error) {
							throw new Error(`Unable to upload ${item.file.name} due to an error. Code: ${item.error.code}. Message: ${item.error.message}`);
						}

						console.log(`Uploaded ${item.file.name} to ${item.result.path}`);
						const url = '/download' +  item.result.path;

						callback(undefined, url);
					}
				}
			});
		}).catch((err) => {
			return callback(err);
		});
	}

	getJsonResponseBody(response) {
		return response.json((result) => {
			return result;
		}).catch((err) => {
			return Promise.resolve({});
		})
	};
}

export default new RequestManager();