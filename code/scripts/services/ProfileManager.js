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

}

export default new ProfileManager();