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
            if(showButtons){
                message.longHtml = `<div> <p>${message.shortHtml}</p>
            <psk-img label="Leaflet" src="/messages/${message.id}/attachment.png"></psk-img>
            <psk-grid columns="6" layout="m=[2,2,1,2,2,2] l=[2,2,1,2,2,2] xl=[2,2,1,2,2,2]">
                <div></div>
                <div></div>
                <div></div>
                <psk-button label="Approve"></psk-button>
                <psk-button label="Reject"></psk-button>
                                <div></div>
            </psk-grid>
            </div>`;
            }else {
                message.longHtml = `<div> <p>${message.shortHtml}</p>
            <psk-img label="Leaflet" src="/messages/${message.id}/attachment.png"></psk-img>
            </div>`;
            }
        }
        $$.interactions
            .startSwarmAs("test/agent/007", "messageLoader", "mountDSU", `/app/messages/${message.id}`, message.dsu)
            .onReturn((err, res) => {
                element.querySelector("#messageContent").innerHTML = message.longHtml;
            });
    }
}