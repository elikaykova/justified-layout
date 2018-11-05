let data1 = [{width: 3000, height:3000},
			{width: 3000, height:4000},
			{width: 3000, height:4000},
			{width: 3000, height:3000},
			{width: 3000, height:4000},
			{width: 4000, height:3000},
			{width: 4000, height:3000},
			{width:  224, height: 224},
			{width:  780, height: 585},
			{width: 1000, height:1500},
			{width: 1920, height:1200},
			{width: 1280, height: 600}
		   ];

let data2 = [{width: 3000, height:3000},
			 {width: 3000, height:3000},
			 {width: 4000, height:3000},
			 {width: 4000, height:3000},
			 {width:  224, height: 224},
			 {width:  780, height: 585},
			 {width: 1000, height:1500},
			 {width: 1920, height:1200},
			 {width: 1280, height: 600}
		   ];

const data = data2;
const viewport = 1440;
const idealRowHeight = 300;
const maxShrinkFactor = 100;
const maxStretchFactor = 100;
const photoNumber = 9;

const START = 0;
let nodes = [];
let PATH = []; 
let result = [];
let res;


function Node(parent, value, weight) {

    this.value = value;
    this.children = [];
    this.parent = parent;
    this.weight = weight;
    this.badness = 0;

    this.setBadness = function() {
    	this.badness = this.weight * this.weight + this.parent.badness; 
    }

    this.getBadness = function() {
        return this.badness;
    }

    this.setParentNode = function(node) {
        this.parent = node;
    }

    this.getParentNode = function() {
        return this.parent;
    }

    this.addChild = function(node, weight) {
        node.setParentNode(this);
        this.children[this.children.length] = node;
        node.setWeight(weight);
    }

    this.getChildren = function() {
        return this.children;
    }

    this.setWeight = function(weight) {
    	this.weight = weight;
    	this.setBadness();
    }

    this.getWeight = function() {
        return this.weight;
    }
}


function findBestHeight(accumulatedWidth) {
	return Math.floor(viewport*idealRowHeight/accumulatedWidth);
}

function scalingUpToFit(height, currHeight, currWidth) {
	return height*currWidth/currHeight;
}

function scalingDownToFit(height, currHeight, currWidth) {
	return height*currWidth/currHeight;
}

function resize(start, end, height) {
	let widthSum = 0;
	for(var i = start; i < end - 1; i++) {
		currWidth = Math.floor(scalingDownToFit(height, data[i].height, data[i].width));
		result.push({"width": currWidth, "height": height});
		widthSum += currWidth;
	}
	result.push({"width": viewport - widthSum, "height": height});
}

function goTroughtGroups(start, end) {
	let currWidth = 0;
	for(var i = start; i < end; i++) {
		currWidth += Math.floor(scalingDownToFit(idealRowHeight, data[i].height, data[i].width));
		//console.log("photo(" + i + ") : ");
		//console.log(idealRowHeight + " " + data[i].height + " " + data[i].width);
	}

	let restWidth = viewport - currWidth;
	let currHeight = findBestHeight(currWidth);
	console.log("currHeight: " + currHeight);
	resize(start, end, currHeight);
}

function goTroughtBreaks() {
	//console.log(PATH.length);
	for(var i = 1; i < PATH.length; i++) {
		goTroughtGroups(PATH[i-1], PATH[i]);
		//console.log("hey");
	}
}

function findWeight(start, end) {
	let currWidth = 0;
	for(var i = start; i < end; i++) {
		currWidth += Math.floor(scalingDownToFit(idealRowHeight, data[i].height, data[i].width));
	}

	//console.log(currWidth);
	//console.log(findBestHeight(currWidth));
	return findBestHeight(currWidth);
}

function exists(node) {
	for(var i = 0; i < nodes.length; i++) {
		if(nodes[i].value == node) return i;
		return false;
	}
}

function findChildren(currIndex) {
	console.log("nodes_length: " + nodes.length);
	console.log("parent " + currIndex);
	let widthSum = 0;
	while(widthSum < viewport && currIndex < photoNumber) {
		widthSum += Math.floor(scalingDownToFit(idealRowHeight, data[currIndex].height, data[currIndex].width));
		//console.log("widthSum: " + widthSum);
		currIndex++;
	}
	console.log("child_1 " + (currIndex - 2));
	if(currIndex >= photoNumber) return currIndex - 1;
	currIndex--; // loop is one step longer
	console.log("child_2 " + (currIndex));
	return currIndex - 1;
}

function generateGraph() {
    let notFound = true;
    let notDouble = 2;
    nodes.push(new Node(null, START, 0));
    let currIndex = 0;

    while(notFound || notDouble) {
    	console.log("times left from first found path: " + notDouble);
        let children = [];
        children[0] = findChildren(nodes[currIndex].value);
        children[1] = children[0] + 1;

        for(var i = 0; i < 2; i++) {
        	if(children[i] >= photoNumber) {
        		notDouble--;
        		notFound = false;

        		if(res)console.log("ResBadness: " + res.getBadness() + " currBadness: " + nodes[currIndex].getBadness());
        		console.log("resB: " + res);
        		if(!res || res.getBadness() > nodes[currIndex].getBadness())
        			res = nodes[currIndex];
        		console.log("resA: " + res.value);
        		if(i == 1) break;
        	}

        	let position = exists(children[i]);
        	let currNode = new Node(nodes[currIndex], children[i], idealRowHeight - findWeight(nodes[currIndex].value, children[i]));
        	console.log("new node: " + nodes[currIndex].value + " " + children[i]);
        	currNode.setBadness();
        	if(!position) nodes.push(currNode);
        	else if(currNode.getBadness() < nodes[position].getBadness()) { 
        		console.log(nodes.position + " -> " + children[i]);
        		nodes[position] = currNode;
        	}	
        }
    	currIndex++;
    }
}

function findPath(node){
	if(node.value == START) {
		//console.log(node.value);
		PATH.push(node.value);
		return;
	}

	findPath(node.getParentNode());
	//console.log(node.value);
	PATH.push(node.value);
}

function test() {
	generateGraph();
	console.log("result: " + res.value);
	findPath(res);
	PATH.push(photoNumber);
	console.log(PATH);
}

test();
