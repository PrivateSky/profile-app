//Add specific code here (swarms, flows, assets, transactions)
$$.swarm.describe("messageLoader", {
    mountDSU: function (mountPath, seed) {
        rawDossier.mount(mountPath, seed, (err) => {
            rawDossier.listFiles(mountPath, (err, files) => {
                console.log("Got files", files);
                this.return();
            });
        });
    }
});