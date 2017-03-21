/*
    This is a template file for checking if certain directories
    / paths are necessary to exist before the API server runs.

 */

var fs = require('fs');
var execSync = require('child_process').execSync;

//List of directories to check for
var directories = [
  "./datafiles",
  "./datafiles/csv",
  "./secrets",
  "./logs"
];


function init(){

  for (var directory = 0; directory < directories.length; directory++){
    checkDirectory(directories[directory]);
  }

  python_scripts();
  java_scripts();
}

function clone_repo(repo, foldername) {
    execSync("git clone " + repo + " " + foldername);
}

function checkDirectory(directoryPath){
  if (fs.existsSync(directoryPath)) {
      // Do nothing
  } else{
      //Create the directory
      console.log("Creating " + directoryPath + "...");
      fs.mkdirSync(directoryPath);
  }
}

module.exports = {
  init: init
};
