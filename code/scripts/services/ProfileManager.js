import RequestManager from './RequestManager.js';

class ProfileManager {
	constructor() {
		const pskCommunicationNodeAddrs = ["http://localhost:8080/"];
		const se = require("swarm-engine");
		se.initialise();
		const powerCord = new se.SmartRemoteChannelPowerCord(pskCommunicationNodeAddrs);
		$$.swarmEngine.plug("*", powerCord);
	}

	get(callback) {
		$$.interactions.startSwarmAs("demo/agent/system", "Profile", "get").onReturn(callback);
	}

	update(profile, callback) {
		$$.interactions.startSwarmAs("demo/agent/system", "Profile", "update", profile).onReturn(callback);
	}

	uploadAvatar(file, callback) {
		// Upload endpoint
		const url = `/upload?path=/data&filename=${file.name}&maxSize=16m&allowedTypes=image/jpeg,image/png,image/gif`;

		RequestManager.upload(url, file, callback);
	}

}

export default new ProfileManager();