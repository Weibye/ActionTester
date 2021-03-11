/* Assumptions
 * All example will be within the ./example folder
 * All examples are required to be listed in the examples/README.md file
 * Every single .rs file inside the examples folder represents unique examples
 * Only example files will have the .rs filending
 */

const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs");

try {
    console.log("======= Starting Job =======");

    const exampleDir = './examples/';
    const readmePath = exampleDir + 'README.md';
    // Check that the example directory exists
    if (!fs.existsSync(exampleDir)) {
        core.setFailed('Example directory not found: ' + exampleDir);
        return;
    }

    // Check that the readme exists
    if (!fs.existsSync(readmePath)) {
        core.setFailed('Examples README not found: ' + readmePath);
        return;
    }


    console.log("======= Readme =======");
    // Get the readme
    let readmeExamples = GetReadmeExamples(exampleDir +'README.md');

    // readmeExamples.forEach(element => {
    //     console.log(element);
    // });

    console.log("======= Directories =======");
    const dir = GetDirectories(exampleDir);

    console.log("======= File list =======");
    dir.forEach(element => {
        console.log(element);
    });




    // const time = (new Date()).toTimeString();
    // core.setOutput("time", time);

    // // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2);
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}


function GetDirectories(directory) {
    let filesInDirectories = new Array();

    const dirs = fs.readdirSync(directory, { withFileTypes: true });

    for (let index = 0; index < dirs.length; index++) {
        const element = dirs[index];
        if (element.isDirectory()) {
            // console.log('Dir: ' + directory + element.name);
            filesInDirectories = filesInDirectories.concat(GetDirectories(directory + element.name + '/'));
        } else {
            // Make sure the file is an .rs file
            var str = element.name.split(".");
            if (str[str.length -1] === "rs") {
                const result = directory.split("/");
                const category = result[result.length - 2];
                const file = {file: element.name, category: category, path: directory + element.name };

                filesInDirectories.push(file);
            }
        }
    }

    return filesInDirectories;
}



function GetReadmeExamples(exampleReadmePath) {
    let exampleContents = new Array();

    var fileContent = fs.readFileSync(exampleReadmePath).toString();
    
    const regex = /(?<=\[`\b)(.*?[.rs])(?=`\])/g;

    let m;

    while ((m = regex.exec(fileContent)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
            if (groupIndex == 0)
            {
                exampleContents.push(match);
            }
        });
    }
    return exampleContents;
}