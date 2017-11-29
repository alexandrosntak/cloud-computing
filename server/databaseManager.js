const bcrypt = require("bcrypt");
const fs = require("fs");
// Database Connection
var db;
var cloudant;
var dbCredentials = {
    dbName: 'cloudcomputingchat'
};

function DatabaseManager() {

	this.initDBConnection();

}



DatabaseManager.prototype.doesUsernameExist = function (username, callback) {

	callback(false);
};

/*
* registerData = {
* 	"username": username,
*   "password": password,
*	"picturePath": ""
* }
* */

DatabaseManager.prototype.registerUser = function (username, password, picturePath, callback) {
	
	var hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

	callback();
};

/*
*
* loginData = {
* 	"username": username,
*   "password": password
* }
*
*
* */
DatabaseManager.prototype.areLoginDataValid = function (loginData, callback) {
	callback({
		status: true,
		picturePath: ""
	});
};

DatabaseManager.prototype.getDBCredentialsUrl = function (jsonData, callback) {
    var vcapServices = JSON.parse(jsonData);
    console.log("vcapServices", vcapServices);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    for (var vcapService in vcapServices) {
    	console.log("vcapService", vcapService);
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
};

DatabaseManager.prototype.initDBConnection = function (callback) {
    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
	console.log("VCAP_SERVICES", process.env.VCAP_SERVICES);
    if (process.env.VCAP_SERVICES) {
        dbCredentials.url = this.getDBCredentialsUrl(process.env.VCAP_SERVICES);
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Once you have the credentials, paste them into a file called vcap-local.json.
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
        dbCredentials.url = this.getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
    }
	console.log("credentials", dbCredentials);
    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);

    console.log('Database connection establish..');
};

module.exports = DatabaseManager;