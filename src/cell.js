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

module.exports = Cell;
