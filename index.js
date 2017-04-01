const WIDTH = HEIGHT = 50;
const allDirections = {top: [-1, 0], bottom: [1, 0], left: [0, -1], right: [0, 1]};
const oppDirectionMap = {top:"bottom", left: "right", right:"left", bottom:"top"};
const OPEN = "open";
const CLOSED = "closed";

class Cell{
	constructor(cords){
		this.visited = false;
		this.tracked = false;
		this.walls = {left:CLOSED, right:CLOSED, top:CLOSED, bottom:CLOSED};
		this.cords = cords;
	}
	markOpen(direction) { 
		this.walls[direction] = OPEN; 
	}
	getOpenWalls(){
		return Object.keys(this.walls).filter(each => {
			return this.walls[each] == OPEN;
		});
	}
	getClosedWall() {
		var walls = this.walls;
		return Object.keys(walls).filter(each => { return walls[each] == CLOSED; });
	}
}

class Maze{
	constructor(width, height, cells){
		this.width = width;
		this.height = height;
		this.grid = cells;
	}
	createMaze(cell) {
		cell.visited = true;
		var neighbours = this.getUnvisitedNeighbours(cell);
		while(neighbours.length) {
			var neighbour = neighbours.splice(Math.floor(Math.random() * neighbours.length), 1)[0];
			if(!neighbour.cell.visited){
				cell.markOpen(neighbour.direction);
				neighbour.cell.markOpen(oppDirectionMap[neighbour.direction])
				this.createMaze(neighbour.cell);
			}
		}
	}
	getUnvisitedNeighbours(cell){
		return Object.keys(allDirections).map(direction => {
			var newCords = addCords(cell.cords, allDirections[direction]);
			if(this.isValid(newCords)){
				var nextCell = this.cellAt(newCords);
				if(!nextCell.visited) return {direction:direction, cell: nextCell};
			}
		}, this).filter(Boolean);
	}
	cellAt(cords) { return this.grid[cords[0]][cords[1]]; }
	solve(currentCell, drawCell) {
		drawCell(currentCell);
		currentCell.tracked = true;
		currentCell.getOpenWalls().map(wall => {
			return this.cellAt(addCords(currentCell.cords, allDirections[wall]));
		}, this)
		.filter(each => {return !each.tracked})
		.forEach(untrackedCell => {
			this.solve(untrackedCell, drawCell);
			drawCell(untrackedCell);
		}, this);
	}
	isValid(newCords){
		return (newCords[0] < this.width && newCords[0] > -1 && newCords[1] < this.height && newCords[1] > -1);
	}
}

function addCords(cords1, cords2) {
	return [cords1[0] + cords2[0], cords1[1] + cords2[1]];
}

function drawMaze(grid) {
	var tr = d3.select("#container").selectAll("tr").data(grid);
	tr.enter()
		.append("tr")
		.selectAll("td")
		.data(function(d){return d}).enter()
		.append("td")
		.each(function(d) {
			var dElem = d3.select(this);
			d.getClosedWall().forEach(function(direction){
				dElem.style("border-" + direction, "2px black solid");
			});
			if(d.isDestination){
				dElem.style("background-color", "black");
			}
		});
}

function cellDrawer() {
	var counter = 0;
	return (cell) => {
		setTimeout(() => {
			var tr = d3.select("#container").selectAll("tr");
			if (cell.isDestination) window.location.href = window.location.href;
			var cords = cell.cords
			var current = tr._groups[0][cords[0]].childNodes[cords[1]];
			current.classList.toggle("current");
		}, 5*(counter+=5));
	}
}

function createCells() {
	return new Array(HEIGHT).fill("-").map((a, y) => {
		return new Array(WIDTH).fill("-").map((b, x) => {
			return new Cell([y, x]);
		});
	});
}

function getRandomCords(){
	return [Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT)];
}

window.onload = function() {
	var maze = new Maze(WIDTH, HEIGHT, createCells());
	var destination = maze.cellAt(getRandomCords());
	destination.isDestination = true;
	maze.createMaze(maze.cellAt([0, 0]));
	drawMaze(maze.grid);
	maze.solve(maze.cellAt([0, 0]), cellDrawer());
}