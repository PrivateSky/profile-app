export default {
    displayMessage(message, element) {

        if (typeof $$.interactions === "undefined") {
            require('callflow').initialise();
            const se = require("swarm-engine");
            const identity = "test/agent/007";
            se.initialise(identity);
            const SRPC = se.SmartRemoteChannelPowerCord;
            let swUrl = "http://localhost:8080/";
            const powerCord = new SRPC([swUrl]);
            $$.swarmEngine.plug(identity, powerCord);
        }

        if (typeof message.longHtml === "undefined") {
            message.longHtml = `<div> <p>Please review the below leaflet and act accordingly</p> 
            <iframe src="/${message.id}" style="width: 100%; height:400px;"></iframe>
            <psk-button label="Approve"></psk-button>
            <psk-button label="Reject"></psk-button></div>`;
        }
        $$.interactions
            .startSwarmAs("test/agent/007", "messageLoader", "mountDSU", "/" + message.id, message.dsu)
            .onReturn((err, res) => {
                element.querySelector("#messageContent").innerHTML = message.longHtml;
            });
    }
}