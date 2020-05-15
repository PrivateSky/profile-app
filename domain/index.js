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