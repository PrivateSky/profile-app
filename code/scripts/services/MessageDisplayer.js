export default {
    displayMessage(message, element, showButtons) {
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
            if (showButtons) {
                message.longHtml = `<psk-ssapp app-name="${message.id}" landing-path="/review-leaflet"></psk-ssapp>`
            } else {
                message.longHtml = `<psk-ssapp app-name="${message.id}" landing-path="/view-leaflet"></psk-ssapp>`
            }
        }
        $$.interactions
            .startSwarmAs("test/agent/007", "messageLoader", "mountDSU", `/apps/${message.id}`, message.dsu)
            .onReturn((err, res) => {
                element.querySelector("#messageContent").innerHTML = message.longHtml;
            });
    }
}