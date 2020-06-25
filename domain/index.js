//Add specific code here (swarms, flows, assets, transactions)
$$.swarm.describe("messageLoader", {
    mountDSU: function (mountPath, seed) {
        rawDossier.mount(mountPath, seed, {persist: false}, this.return);
    }
});