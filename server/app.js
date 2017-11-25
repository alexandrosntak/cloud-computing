"use strict";

const express = require("express");
const path = require("path");
const initServer = require("./server");
const SocketGateway = require("./socketGateway");
const FileManager = require("./fileManager");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const DatabaseManager = require("./databaseManager");
const PictureAnalyzer = require("./pictureAnalyzer");

require("dotenv").config({silent: true});

const port = process.env.PORT || process.env.VCAP_APP_PORT || 8080;
const homePath = path.join(__dirname, "..");
const clientPath = path.join(homePath, "client");

const maxNumberOfUsers = 100;

function App() {

	this.expressApp = express();
    this.expressApp.enable("trust proxy");

	/*this.expressApp.get("/", (req, res) => {
		res.sendFile(clientPath + "/index.html");
	});*/

    this.expressApp.use((req, res, next) => {

        if (req.secure || req.headers.host === "localhost:8080") {

            next();
        } else {
            res.redirect('https://' + req.headers.host + req.url);
        }

    });

	this.expressApp.use(express.static(clientPath));
	this.expressApp.use(bodyParser.json());

	this.io = socketIO(initServer(port, this.expressApp));
	this.users = {};
	this.fileManager = new FileManager();
	this.databaseManager = new DatabaseManager();
	this.pictureAnalyzer = new PictureAnalyzer();


	setInterval(() => {
		this.fileManager.deleteFilesOlderThan(this.getOldestUserTimestamp());
	}, 30 * 60 * 1000);

	new SocketGateway(this);
}

App.prototype.addUser = function(username, socket) {

	let loginSuccessful = {
		status: false,
		reason: ""
	};

	if(Object.keys(this.users).length === maxNumberOfUsers){
		loginSuccessful.reason = "The server is full";
	}
	else {
		this.users[username] = socket;
		loginSuccessful.status = true;
	}
	return loginSuccessful;
};

App.prototype.removeUser = function (username) {
	delete this.users[username];
};

App.prototype.getOldestUserTimestamp = function () {
	let oldestTimestamp = Date.now();
	for(let key in this.users){
		if(this.users.hasOwnProperty(key)){
			let userSocket = this.users[key];
			let userTimestamp = userSocket.handshake.issued;
			if(oldestTimestamp === undefined || userTimestamp < oldestTimestamp){
				oldestTimestamp = userTimestamp;
			}
		}
	}
	return oldestTimestamp;
};

App.prototype.doesUsernameExist = function (username, callback) {
	this.databaseManager.doesUsernameExist(username, callback);
};

App.prototype.registerUser = function (registerData, callback) {
	this.databaseManager.registerUser(registerData, callback);
};

App.prototype.isProfilePictureValid = function (pictureData, callback) {
	this.fileManager.saveTemporaryProfilePicture(pictureData, (picturePath) => {

		this.pictureAnalyzer.isFaceContainedInPicture(picturePath, (result) => {

			callback(result);

		});


	});

};

App.prototype.areLoginDataValid = function (loginData, callback) {
    this.databaseManager.areLoginDataValid(loginData, callback);
};

new App();