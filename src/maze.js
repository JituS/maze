
var movingLocation = {up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0]};

function Maze(width, height) {
	this.width = width;
	this.height = height;
	this.maze;
	this.currentLocation = [0, 0];
}

Maze.prototype.getMaze = function(){
	var array = new Array(this.width).fill("-");
	var height = this.height;
	this.maze = array.map(function() {
		return new Array(height).fill(0);
	});
	this.fill(0, 0);
	return this;
}

Maze.prototype.fill = function(x, y){
	this.maze[x][y] = 1;
	return this;
}

function getNextDirection(canGo) {
	var randomNumber = Math.floor(Math.random() * canGo.length);
	return movingLocation[canGo[randomNumber]];
}

Maze.prototype.movable = function(location){
	var x = location[0];
	var y = location[1];
	return this.maze[x] != undefined && this.maze[x][y] != undefined && this.maze[x][y] != 1;
}

Maze.prototype.canGo = function(){
	var maze = this;
	return Object.keys(movingLocation).filter(function(each) {
		var next = [maze.currentLocation[0] + movingLocation[each][0], maze.currentLocation[1] + movingLocation[each][1]]
		return maze.movable(next);
	});
}


function createHappyPath(maze) {
	var currentLocation = maze.currentLocation;
	if(currentLocation[1] > maze.width - 1) return maze;
	var canGo = maze.canGo();
	if(canGo.length == 0) return maze;
	var nextDirection = getNextDirection(canGo);
	var nextLocation = [currentLocation[0] + nextDirection[0], currentLocation[1] + nextDirection[1]]
	maze.fill(nextLocation[0], nextLocation[1]);
	maze.currentLocation = nextLocation;
	console.log(maze)
	return createHappyPath(maze);
}

