const fs = require("fs");
const DOSSIER_SEED_FILE_PATH = "seed";
require("./../../privatesky/psknode/bundles/csbBoot.js");
require("./../../privatesky/psknode/bundles/edfsBar.js");
const EDFS = require("edfs");
const EDFS_ENDPOINT = "http://127.0.0.1:8080";
let edfs = EDFS.attachToEndpoint(EDFS_ENDPOINT);

function createWallet(callback) {
	const bar = edfs.createBar();
	updateWallet(bar, callback);
}

function updateWallet(bar, callback) {
	bar.addFolder("code", "/", (err, archiveDigest) => {
		if (err) {
			return callback(err);
		}
		const seed = bar.getSeed();
		fs.writeFile(DOSSIER_SEED_FILE_PATH, seed, (err) => {
			return callback(err, seed);
		});
	});
}

function build(callback) {
	fs.readFile(DOSSIER_SEED_FILE_PATH, (err, content) => {
		if (err || content.length === 0) {
			return createWallet(callback);
		}
		const bar = edfs.loadBar(content);
		updateWallet(bar, callback);
	});
}

build(function (err, seed) {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	console.log("Profile App wallet Seed:", seed);
});