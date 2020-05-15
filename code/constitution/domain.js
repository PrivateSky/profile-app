domainRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"./../../domain":[function(require,module,exports){
//Add specific code here (swarms, flows, assets, transactions)

const profileFile = "/data/profile.json";

$$.swarms.describe("Profile", {
	get: function(){
		if (rawDossier) {
			return rawDossier.readFile(profileFile, (err, content)=>{
				if(err){
					return this.return(err);
				}
				this.return(undefined, JSON.parse(content));
			});
		}

		this.return(new Error("Raw Dossier is not available."));
	},
	update: function(profile){
		if (rawDossier) {
			return rawDossier.writeFile(profileFile, JSON.stringify(profile), this.return);
		}

		this.return(new Error("Raw Dossier is not available."));
	}
});

console.log("Profile-app constitution loaded!");
},{}],"/opt/rwork/ePI/profile-app/builds/tmp/domain_intermediar.js":[function(require,module,exports){
(function (global){
global.domainLoadModules = function(){ 

	if(typeof $$.__runtimeModules["./../../domain"] === "undefined"){
		$$.__runtimeModules["./../../domain"] = require("./../../domain");
	}
};
if (true) {
	domainLoadModules();
}
global.domainRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("domain");
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../domain":"./../../domain"}]},{},["/opt/rwork/ePI/profile-app/builds/tmp/domain_intermediar.js"])