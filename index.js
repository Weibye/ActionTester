const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs");

try {
    
    console.log("Staring Job");

    const dir = GetDirectories('./examples/');

    dir.forEach(element => {
        console.log(element);
    });

    // Get the readme
    var readmeContent = fs.readFileSync('./examples/README.md').toString();
    console.log(readmeContent);


    const time = (new Date()).toTimeString();
    core.setOutput("time", time);

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}


function GetDirectories(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).map(dirent => dirent.name);
}