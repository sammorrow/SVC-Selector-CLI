const View = require('./SVC.json')

if (process.env.NODE_ENV !== 'test') process.stdout.write('Please input a selector below, or type --exit to leave.\n> ')

process.stdin.on('data', rawData => {
  if (sanitize(rawData) === '--exit') process.exit();

  const commands = parseCmd(sanitize(rawData)),
    output = DFSTraverse(View, commands)
  if (process.env.NODE_ENV !== 'test') process.stdout.write(JSON.stringify(output, null, 1) + "\n\nMetadata:\nLength: " + JSON.stringify(output.length, null, 1) + '\n\n> ')
  else process.stdout.write(JSON.stringify(output.length))
})

function sanitize(data){
  return data.toString().trim()
}

/*

parseCmd first breaks down each command into distinct selectors, then runs through each selector to determine what type of selector
it is. It returns the enqueued selectors in array format.

*/

function parseCmd(input){
  const selectorArr = input.split(' ')
  return selectorArr.map(word => {
    let bucket = 'classType', classIdx = -1,
      wordHash = {
        classType: '',
        classNames: [],
        identifier: ''
      };
  
    word.split('').forEach(letter => {
      if (letter === '.') {
        bucket = 'classNames'
        classIdx++
        wordHash[bucket][classIdx] = ''
      }
      else if (letter === '#') bucket = 'identifier'
      else if (bucket === 'classNames') wordHash[bucket][classIdx] += letter
      else wordHash[bucket] += letter
    })
    return wordHash
  })
} 

/*

DFSTraverse runs a depth-first search on the DOM-like object, processing nodes one-by-one in a queue and pushing in children as it finds them.
It affixes a 'cmdDepth' property onto nodes in order to track how 'deep' we are into our command array for the purposes of multiple selectors.
When a given node matches the final selector in a selection-chain, it is pushed into an array of selected nodes.

*/

function DFSTraverse(tree, commands){
  let queue = [tree], node = {}, selectedNodes = [];

  while (queue.length){
    node = queue.shift();
    if (!node.cmdDepth) node.cmdDepth = 0;
    let { cmdDepth } = node,
       cmd = commands[Math.min(commands.length - 1, cmdDepth)]

    if (isValidMatch(cmd, node)) {
      cmdDepth++;
      if (cmdDepth >= commands.length) selectedNodes = selectedNodes.concat([node])
    }

    if (node.contentView) queue = queue.concat(node.contentView.subviews.map(node => Object.assign({}, node, {cmdDepth})))
    if (node.subviews) queue = queue.concat(node.subviews.map(node => Object.assign({}, node, {cmdDepth})))
  }
  return selectedNodes
}

/*

isValidMatch coerces a given tree node through a hefty set of controls into a boolean that tells us whether or not this node meets the
requirements of the current selector in the selector chain.

*/

function isValidMatch(cmd, node){
  const { classType, classNames, identifier } = cmd
  return (!classNames.length || classNames.filter(className => node.classNames && node.classNames.includes(className)).length === classNames.length)
  && (!identifier || node.identifier === identifier || (node.control && node.control.identifier === identifier))
  && (!classType || node.class === classType) 
}