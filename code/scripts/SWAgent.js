export default class SWAgent {

    constructor(seed, doneCallback, env) {
        this.seed = seed;
        this.doneCallback = doneCallback;
        this.env = env ? env : 'production';
    }

    registerWorker(path) {
        navigator.serviceWorker.register(path, {
            scope: '/'
        }).then(() => {
            return this.sendMessage({action: "activate"});
        }).then(() => {
            return this.sendMessage({
                seed: this.seed,
                url: window.location.origin
            })
        }).then((data) => {
            this.doneCallback(null, data);
        }).catch((err) => {
            console.error(err);
            this.doneCallback(err);
        })
    }

    sendMessage(message) {
        // This wraps the message posting/response in a promise, which will
        // resolve if the response doesn't contain an error, and reject with
        // the error if it does. If you'd prefer, it's possible to call
        // controller.postMessage() and set up the onmessage handler
        // independently of a promise, but this is a convenient wrapper.
        return new Promise(function (resolve, reject) {
            var messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = function (event) {
                if (event.data.error) {
                    reject(event.data.error);
                } else {
                    resolve(event.data);
                }
            };

            // This sends the message data as well as transferring
            // messageChannel.port2 to the service worker.
            // The service worker can then use the transferred port to reply
            // via postMessage(), which will in turn trigger the onmessage
            // handler on messageChannel.port1.
            // See
            // https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage

            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
            } else {
                navigator.serviceWorker.oncontrollerchange = function () {
                    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
                };
            }

        });
    };

    static load(seed, callback, environment) {
        const loader = new SWAgent(seed, callback, environment);
        loader.registerWorker('/swBoot.js');
        SWAgent.loader = loader;
    }
}
