var OPEN = "open";
var CLOSED = "closed";
function Cell(cords) {
	this.visited = false;
	this.leftWall = CLOSED;
	this.rightWall = CLOSED;
	this.topWall = CLOSED;
	this.bottomWall = CLOSED;
	this.cords = cords;
}

Cell.prototype.markOpen = function(side) {
	this[side] = OPEN;
}

var WIDTH = HEIGHT = 50;
var movingDirections = {up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1]};
var wallMap = {up: "topWall", down: "bottomWall", left: "leftWall", "right": "rightWall"};
var oppMap = {up:"down", left: "right", right:"left", down:"up"};

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
		return new Cell([y, x]);
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
	while(allUnvisitedNeighbours.length) {
		var neighbour = allUnvisitedNeighbours.splice(Math.floor(Math.random() * allUnvisitedNeighbours.length, 1))[0];
		if(!neighbour.neighbourCell.visited){
			cell.markOpen(wallMap[neighbour.side]);
			neighbour.neighbourCell.markOpen(wallMap[oppMap[neighbour.side]])
			neighbour.neighbourCell.visited = true
			this.createMaze(neighbour.neighbourCell);
		}
	}
	return;
};

function createDiv(cell){
	var borderBottom = (cell.bottomWall == CLOSED) ? "border-bottom:1px black solid;" : "";
	var borderTop = (cell.topWall == CLOSED) ? "border-top:1px black solid;" : "";
	var borderLeft = (cell.leftWall == CLOSED) ? "border-left:1px black solid;" : "";
	var borderRight = (cell.rightWall == CLOSED) ? "border-right:1px black solid;" : "";
	var all = '<td style="background-color:white;' + borderTop + borderRight + borderLeft + borderBottom + ' width:7px; height:7px;"></td>';
	return all;
}

window.onload = function() {
	var container = document.querySelector("#container");

	var maze = new Maze(WIDTH, HEIGHT, allCells);
	maze.startCreatingMaze();
	var all = "";
	all += maze.grid.map(function(each) {
		return "<tr>" + each.map(function(e){
			return createDiv(e);
		}).join("") + "</tr>"
	}).join("")
	container.innerHTML = all;
}

