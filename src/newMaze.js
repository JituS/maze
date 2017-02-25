var Cell = require("./cell");

var WIDTH = HEIGHT = 10;
var movingDirections = {up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0]};
var wallMap = {up: "topWall", down: "bottomWall", left: "leftWall", "right": "rightWall"};

function Maze(width, height, cells) {
	this.width = width;
	this.height = height;
	this.grid = cells;
}

Maze.prototype.startCreatingMaze = function(){
	var initialPlace = this.grid[0][0];
	initialPlace.visited = true;
	this.createMaze(initialPlace);
};

Maze.prototype.getUnvisitedNeighbour = function(cell) {
	var self = this;
	var neighbours = [];
	Object.keys(movingDirections).forEach(function(eachDirection) {
		var newCords = [cell.cords[0] + movingDirections[eachDirection][0], cell.cords[1] + movingDirections[eachDirection][1]];
		if(newCords[0] < self.width && newCords[0] > -1 && newCords[1] < self.height && newCords[1] > -1){
			var neighbourCell = self.grid[newCords[0]][newCords[1]];
			if(!neighbourCell.visited){
				var eachNeighbour = {};
				eachNeighbour.side = eachDirection;	
				eachNeighbour.neighbourCell = neighbourCell;
				neighbours.push(eachNeighbour);
			} 
		}
	});
	return neighbours;
}

var allCells = new Array(HEIGHT).fill("-").map(function(a, y) {
	var something = new Array(WIDTH).fill("-");
	return something.map(function(b, x) {
		return new Cell([x, y]);
	});
});


Maze.prototype.getAnyNeighbour = function(initialPlace) {
	var allUnvisitedNeighbours = this.getUnvisitedNeighbour(initialPlace);
	// var neighbour = allUnvisitedNeighbours[Math.floor(Math.random() * allUnvisitedNeighbours.length)];
	if(neighbour) initialPlace.markOpen(wallMap[neighbour.side]);
	return neighbour.neighbourCell;
};

Maze.prototype.createMaze = function(cell){
	cell.visited = true;
	var allUnvisitedNeighbours = this.getUnvisitedNeighbour(cell);
	if(!allUnvisitedNeighbours.length == 0) {
		for (var i = 0; i < allUnvisitedNeighbours.length; i++) {
			var neighbour = allUnvisitedNeighbours[i];
			cell.markOpen(wallMap[neighbour.side]);
			this.createMaze(neighbour.neighbourCell);
		}
	}else{
		return;
	}
};

var maze = new Maze(WIDTH, HEIGHT, allCells);
maze.startCreatingMaze();
maze.grid.forEach(function(each) {
	each.forEach(function(e){
		console.log(e.visited)
	})
});

