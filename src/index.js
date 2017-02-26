
var WIDTH = HEIGHT =40;
var movingDirections = {top: [-1, 0], bottom: [1, 0], left: [0, -1], right: [0, 1]};
var oppSideMap = {top:"bottom", left: "right", right:"left", bottom:"top"};
var OPEN = "open";
var CLOSED = "closed";
var found = false;

function Cell(cords) {
	this.visited = false;
	this.tracked = false;
	this.current = false;
	this.walls = {left:CLOSED, right:CLOSED, top:CLOSED, bottom:CLOSED};
	this.cords = cords;
}

Cell.prototype.markOpen = function(side) {
	this.walls[side] = OPEN;
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

Maze.prototype.createMaze = function(cell){
	cell.visited = true;
	var allUnvisitedNeighbours = this.getUnvisitedNeighbour(cell);
	while(allUnvisitedNeighbours.length) {
		var neighbour = allUnvisitedNeighbours.splice(Math.floor(Math.random() * allUnvisitedNeighbours.length), 1)[0];
		if(!neighbour.neighbourCell.visited){
			cell.markOpen(neighbour.side);
			neighbour.neighbourCell.markOpen(oppSideMap[neighbour.side])
			this.createMaze(neighbour.neighbourCell);
		}
	}
};

var allCells = new Array(HEIGHT).fill("-").map(function(a, y) {
	var something = new Array(WIDTH).fill("-");
	return something.map(function(b, x) {
		return new Cell([y, x]);
	});
});

function showOnScreen(grid) {
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
				if(d.current){
					newd.style("background-color", "black");	
				} 
				if(d.isDestination){
					newd.style("background-color", "red");	
				} 
				newd.style("border-radius", "10px");
			});
		})
}

Maze.prototype.solve = function(init) {
	if(found) return
	showOnScreen(this.grid);
	var initialLocation = init.cords;
	if(init.isDestination) found = true;
	var openWalls = init.getOpenWall();
	var grid = this.grid;
	var routes = openWalls.map(function(wall) {
		var toAdd = movingDirections[wall];
		var newCords = [initialLocation[0] + toAdd[0], initialLocation[1] + toAdd[1]];
		return grid[newCords[0]][newCords[1]];
	});
	var routes = routes.filter(function(ea){
		return  !ea.tracked;
	})
	if(routes.length == 0){
		init.current = false;
	} 
	while(routes.length) {
		var route = routes.splice(Math.floor(Math.random() * routes.length), 1)[0];
		init.tracked = true;
		route.current = true
		setTimeout(this.solve.bind(this, route), 10);
		init.current = false;
	}
	return;
}

window.onload = function() {
	var container = document.querySelector("#container");
	var maze = new Maze(WIDTH, HEIGHT, allCells);
	maze.createMaze(maze.grid[0][0]);
	var all = "";
	var destination = maze.grid[Math.floor(Math.random() * WIDTH)-1][Math.floor(Math.random() * HEIGHT)-1];
	destination.isDestination = true;
	destination.current = true
	showOnScreen(maze.grid);
	maze.solve(maze.grid[0][0]);
}

