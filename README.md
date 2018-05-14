# SVC Selector CLI

## Overview

Command Line Interface tool that traverses a formatted JSON object and collect user-defined nodes.

### Installation and Dependencies

This program requires [nodejs](https://nodejs.org/en/download/) and a package manager, either npm (bundled with node) or [yarn](https://yarnpkg.com/lang/en/docs/install/).

To install, clone this directory, navigate to it in your terminal, and install its dependencies with `npm i / yarn install`. Run the program with `npm start` or test its functionality with `npm test`.

This program uses [mocha](https://mochajs.org/) as a testing suite and [cross-env](https://www.npmjs.com/package/cross-env) for Windows compatibility. 

### Input and Outputs

This program expects its input to be formatted like CSS/JQuery's Element/Class/Identifier selectors. It also supports compound selectors (e.g. 'StackView.container') and multiple selectors (e.g. 'StackView StackView Button').

It outputs to the console every node that matches your selector in array format, ordered depth-first, with a meta-object affixed that displays how many matches you hit.

### Bottlenecks and Considerations

The tool rebuilds the JSON object every time you input a command, enqueuing objects it's building from the actual data. If space becomes a concern, we may want to consider alternatives to the 'cmdDepth' property we're affixing to every node. 

I had never used Mocha to test a CLI-based process. My end approach was to spawn a child process and to control what data is output in a testing environment. This works, but it isn't perfect. It takes some time to fire up the child process and each test only examines the very next chunk of data the child outputs, so we have to keep a close eye on what we're outputting.

In the future it may be worthwhile writing the output to a file. It was difficult at times to read through the console.