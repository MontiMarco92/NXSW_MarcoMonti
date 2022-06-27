// In order to test my algorithm while I was attempting to getting to work properly, I implemented an HTML canvas, where I drew
// the testing matrix so I could visualize it and check how it was working.

const canvas = document.getElementById("canva");

const ctx = canvas.getContext("2d");

// Coordinates at which the matrix will be displayed on screen
const matrixX = 0;
const matrixY = 0;

// size of each cell from the matrix/2dArray
const cellSize = 30;

// COLORS OBJECT
// From the assignment statement I assumed that (for simplicity) each pixel within the 2D array would be represented by an integer (from 0 to 255), which at the same time
// would represent a different color. Having said that, I created a color object with some initial colors and then a function to generate another 253 random colors
// so each pixel could then be associated with a specific color.

let colorObj = {
	0: "rgb(216, 216, 216)",
	1: "#000000",
};

const generateRandomColor = () => {
	if (!colorObj[2]) {
		for (let i = 2; i <= 255; i++) {
			colorObj[i] = `rgb(${i}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
				Math.random() * 256
			)})`;
		}
	}
};
generateRandomColor();

//I used this testing matrix so verify the algorithm
let testingMatrix = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 55, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 55, 55, 55, 1, 0, 0, 0, 0],
	[0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
	[0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
];

//created this function to plot the matrix on the html canvas
const drawMatrix = (matrix) => {
	const rows = matrix.length;
	const cols = matrix[0].length;

	canvas.height = rows * cellSize;
	canvas.width = cols * cellSize;

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const x = matrixX + col * cellSize;
			const y = matrixY + row * cellSize;
			const value = matrix[row][col];
			let color = colorObj[value];
			ctx.fillStyle = color;
			ctx.fillRect(x, y, cellSize, cellSize);
		}
	}
};

//created function to determine if certain coordinates belong to the matrix, returns boolean
const validateCoordinates = (matrix, row, col) => {
	return (
		row >= 0 && row < matrix.length && col >= 0 && col < matrix[row].length
	);
};

//This is the actual requested algorithm

const changeColor = (matrix, row, col, newColor) => {
	let fillStack = []; // stack

	fillStack.push([row, col]);

	const initialColor = matrix[row][col];

	while (fillStack.length > 0) {
		let [row, col] = fillStack.pop();

		//if the pixel is not within the 2D array, continue
		if (!validateCoordinates(matrix, row, col)) {
			continue;
		}

		//if the pixel color is different from the initial color, continue (detects possible shape boundaries)
		if (matrix[row][col] !== initialColor) {
			continue;
		}

		//assign pixel color to the new color
		matrix[row][col] = newColor;

		//I push the current pixel's neighbours inside the execution stack
		fillStack.push([row + 1, col]); // down the current one
		fillStack.push([row - 1, col]); // up the current one
		fillStack.push([row, col + 1]); // rigth to the current one
		fillStack.push([row, col - 1]); // left to the current one
	}

	drawMatrix(matrix); // draw the new matrix to visualize the color changes
};

drawMatrix(testingMatrix); // draw the initial matrix

// I added a 'click' listener just for convenience to check the algorithm working once you click on a certain point of the canvas
canvas.addEventListener("click", (e) => {
	console.log(e);
	const col = Math.floor(e.offsetX / cellSize);
	const row = Math.floor(e.offsetY / cellSize);

	changeColor(testingMatrix, row, col, 33);
});
