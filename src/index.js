const WIDTH = HEIGHT =30;
const allDirections = {top: [-1, 0], bottom: [1, 0], left: [0, -1], right: [0, 1]};
const oppDirectionMap = {top:"bottom", left: "right", right:"left", bottom:"top"};
const OPEN = "open";
const CLOSED = "closed";
var found = false;

function Cell(cords) {
	this.visited = false;
	this.tracked = false;
	this.current = false;
	this.walls = {left:CLOSED, right:CLOSED, top:CLOSED, bottom:CLOSED};
	this.cords = cords;
}

Cell.prototype.markOpen = function(direction) {
	this.walls[direction] = OPEN;
}

Cell.prototype.getOpenWall = function() {
	var walls = this.walls;
	return Object.keys(this.walls).filter(function(each) {
		return walls[each] == OPEN;
	});
}
Cell.prototype.getClosedWall = function() {
	var walls = this.walls;
	return Object.keys(this.walls).filter(function(each) {
		return walls[each] == CLOSED;
	});
}

function Maze(width, height, cells) {
	this.width = width;
	this.height = height;
	this.grid = cells;
}


Maze.prototype.cellAt = function(cords) {
	return this.grid[cords[0]][cords[1]];
}

Maze.prototype.isValid = function(newCords){
	return (newCords[0] < this.width && newCords[0] > -1 && newCords[1] < this.height && newCords[1] > -1);
}

Maze.prototype.getUnvisitedNeighbours = function(cell) {
	var self = this;
	return Object.keys(allDirections).map(function(direction) {
		var newCords = addCords(cell.cords, allDirections[direction]);
		if(self.isValid(newCords)){
			var nextCell = self.cellAt(newCords);
			if(!nextCell.visited){
				return getNeighbour(direction, nextCell)
			} 
		}
	}).filter(Boolean);;
}

Maze.prototype.createMaze = function(cell){
	cell.visited = true;
	var allUnvisitedNeighbours = this.getUnvisitedNeighbours(cell);
	while(allUnvisitedNeighbours.length) {
		var neighbour = allUnvisitedNeighbours.splice(Math.floor(Math.random() * allUnvisitedNeighbours.length), 1)[0];
		if(!neighbour.cell.visited){
			cell.markOpen(neighbour.direction);
			neighbour.cell.markOpen(oppDirectionMap[neighbour.direction])
			this.createMaze(neighbour.cell);
		}
	}
}

function addCords(cords1, cords2) {
	return [cords1[0] + cords2[0], cords1[1] + cords2[1]];
}

function getNeighbour(direction, nextCell) {
	var eachNeighbour = {};
	eachNeighbour.direction = direction;	
	eachNeighbour.cell = nextCell;
	return eachNeighbour;
}

function visualize(grid) {
	d3.select("#container").selectAll("tr").remove();
	var tr = d3.select("#container").selectAll("tr").data(grid);
	tr.enter()
		.append("tr")
		.selectAll("td")
		.data(function(d){return d})
		.enter()
		.append("td")
		.each(function(d) {
			var newd = d3.select(this);
			d.getClosedWall().forEach(function(e){
				newd.style("border-" + e, "1px black solid");
			});
			if(d.current){
				newd.style("background-color", "black");	
			} 
			if(d.isDestination){
				newd.style("background-color", "red");	
			} 
			newd.style("border-radius", "2px");
		});
}

Maze.prototype.solve = function(cell) {
	if(found) return
	visualize(this.grid);
	var initialLocation = cell.cords;
	if(cell.isDestination) found = true;
	var openWalls = cell.getOpenWall();
	var routes = openWalls.map(function(wall) {
		return this.cellAt(addCords(initialLocation, allDirections[wall]));
	}, this).filter(function(each){ return !each.tracked});

	while(routes.length) {
		var route = routes.splice(Math.floor(Math.random() * routes.length), 1)[0];
		cell.tracked = true;
		route.current = true
		setTimeout(this.solve.bind(this, route), 50);
		cell.current = false;
	}
	cell.current = false;
}


var allCells = new Array(HEIGHT).fill("-").map(function(a, y) {
	var something = new Array(WIDTH).fill("-");
	return something.map(function(b, x) {
		return new Cell([y, x]);
	});
});

window.onload = function() {
	var container = document.querySelector("#container");
	var maze = new Maze(WIDTH, HEIGHT, allCells);
	maze.createMaze(maze.cellAt([0, 0]));
	var destination = maze.cellAt([Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT)]);
	destination.isDestination = true;
	visualize(maze.grid);
	maze.solve(maze.cellAt([0, 0]));
}

