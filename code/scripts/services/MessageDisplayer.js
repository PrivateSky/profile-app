class FileDownloader {

    constructor(path, fileName) {
        this.path = path;
        this.fileName = fileName;

        if (this.path === '/') {
            this.path = '';
        }
    }

    downloadFile(callback) {
        if (!callback || typeof callback !== 'function') {
            callback = this.downloadFileToDevice;
        }

        this._getFileBlob(this.path, this.fileName, callback);
    }

    /**
     * @param {Object{ contentType: string, rawBlob: Blob }
     */
    downloadFileToDevice = (downloadedFile) => {
        window.URL = window.URL || window.webkitURL;
        let blob = downloadedFile.rawBlob;

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const file = new File([blob], this.fileName);
            window.navigator.msSaveOrOpenBlob(file);
            return;
        }

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.fileName;
        link.click();
    }

    _getFileBlob(path, fileName, callback) {
        let url = `/download${path}/${fileName}`;
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    response.blob().then((blob) => {
                        callback({
                            contentType: response.headers.get('Content-Type') || '',
                            rawBlob: blob
                        });
                    });
                } else {
                    console.error(`Error on download file ${path}/${fileName}: `, response);
                }
            });
    }
}
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
            message.longHtml = `<div> <p>${message.shortHtml}</p>
            <psk-img label="Leaflet" src="/messages/${message.id}/attachment.png"></psk-img>
            </div>`;
        }
        $$.interactions
            .startSwarmAs("test/agent/007", "messageLoader", "mountDSU", `/app/messages/${message.id}`, message.dsu)
            .onReturn((err, res) => {
                element.querySelector("#messageContent").innerHTML = message.longHtml;
            });
    }
}