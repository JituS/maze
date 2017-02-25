var assert = require("assert");
var chai = require("chai");
var mazeObj = require("../src/maze");
var Maze = mazeObj.Maze;

describe("Maze", function() {
	describe("getMaze", function() {
		it("should return a blank maze grid of given size", function() {
			var maze = new Maze(2, 2);
			var actual = maze.getMaze();
			var expected = new Maze(2, 2);
			expected.maze = [[1, 0], [0, 0]];
			assert.deepEqual(expected, actual);
		});
	}),

	describe("fill", function() {
		it("should put 1 in the given location", function() {
			var actual = new Maze(2, 2).getMaze().fill(1, 0);
			var expected = new Maze(2, 2);
			expected.maze = [[1, 0], [1, 0]];
			assert.deepEqual(expected, actual);
		});
	});

	describe("createHappyPath", function() {
		it("should create path with can be traverse", function() {
			var maze = new Maze(10, 10).getMaze();
			var o = mazeObj.createHappyPath(maze);
			console.log(o.maze, o.currentLocation);
		});
	});	
});