//a and b) Implement an algorithm that can read an adjaceny matrix and builds a graph in memory

class Graph {
	constructor(graph) {
		//check if input is of type matrix/2Darray
		this.adjList = {};
		if (Array.isArray(graph)) {
			//I convert the matrix representation to and adjacency list to then apply methods.
			for (let row = 0; row < graph.length; row++) {
				this.adjList[String.fromCharCode("A".charCodeAt(0) + row)] = [];
				for (let col = 0; col < graph[row].length; col++) {
					if (graph[row][col] === 1) {
						this.adjList[String.fromCharCode("A".charCodeAt(0) + row)].push(
							String.fromCharCode("A".charCodeAt(0) + col)
						);
					}
				}
			}
			//if not, we assume a proper obj{node:[neighbour1,....]} is the input
		} else {
			// Because in the assignment example inputs there's no key in adjacency list
			// representing nodes that have no connections, I generate the key with an
			// empty array, just to hace each key of the adjacency list representing one existing node

			this.adjList = { ...graph };
			for (let key in graph) {
				for (let i of graph[key]) {
					if (!this.adjList.hasOwnProperty(i)) {
						this.adjList[i] = [];
					}
				}
			}
		}
	}

	//methods

	//---------------Algorithm to detect cycles in a graph

	// c) I define the hasCycle method to see if the graph has a cycle or not
	hasCycle = () => {
		//I define three sets
		let unvisited = new Set(); // all the nodes that are not visited
		let stack = new Set(); // the stack where all nodes currently being vistied are
		let visited = new Set(); // all the nodes that are visited, including its neighbours

		//I insert all the graph's nodes into the unvisited set
		for (const node in this.adjList) {
			unvisited.add(node);
		}
		// console.log("unvisited", unvisited);

		//while the unvisisted set has nodes, I keep running the search
		while (unvisited.size > 0) {
			let [source] = unvisited; //I define the variable 'source' as the first item in the unvisited set
			// console.log(source);
			//I execute a 'depth first search passing the current node and the sets
			if (this.#dfs(this.adjList, source, unvisited, stack, visited)) {
				return "Cycle detected";
			}
		}
		return "No cycle was detected";
	};

	#dfs = (adjList, source, unvisited, stack, visited) => {
		//I take the source node from the unvisisted set and move it to the execution stack
		this.#moveNode(source, unvisited, stack);
		// console.log(source);
		// console.log("unvisited", unvisited);
		// console.log("stack", stack);

		// for each neighbour nodes of the source node I check if
		// the neighbour is in the visited set, I continue since I have already
		// checked that node. If the stack set has the neighbour, it means
		// that I have already passed through that node and the neighbours pointed me
		// back again to the same node ('backedge') so a the graph has a cycle
		for (let neighbour of adjList[source]) {
			if (visited.has(neighbour)) {
				continue;
			}
			if (stack.has(neighbour)) {
				return true;
			}
			//I call recursively the search funcion passing the neighbour nodes as the source
			if (this.#dfs(adjList, neighbour, unvisited, stack, visited)) {
				return true;
			}
		}

		// if I reach a dead end node, meaning it has no more neighbours
		// I move that node into the visited set
		this.#moveNode(source, stack, visited);
		// console.log("visited", visited);
		return false;
	};

	//function to move the nodes between origin set to destination set
	#moveNode = (node, originSet, destSet) => {
		originSet.delete(node);
		destSet.add(node);
	};

	// d) ---------------Algorithm to find dependency path in graph, assuming it's an acyclic directed graph

	dependencySort = () => {
		//define an empty stack where the order of traversal will be established
		const stack = [];
		//define visited set to keep track of visited nodes
		const visited = new Set();

		//for each key within the adjacency list I search and sort
		for (let source in this.adjList) {
			// console.log("source", source);
			if (visited.has(source)) {
				continue;
			}
			this.#sort(this.adjList, source, stack, visited);
		}
		return `El orden para satisfacer todas las dependencias es ${stack.join(
			", "
		)}`;
	};

	#sort = (adjList, source, stack, visited) => {
		visited.add(source);
		// console.log("visited", visited);
		// console.log(adjList);
		// for each neihbour of the source node, if it's already visited I continue,
		// if not I execute the sort function recursively
		for (let neighbour of adjList[source]) {
			// console.log("vecino", neighbour);
			if (visited.has(neighbour)) {
				continue;
			}

			this.#sort(adjList, neighbour, stack, visited);
		}
		//I push the node once it's children have been visited into stack
		stack.push(source);

		// console.log("stack", stack);
	};
}

//cyclic
const testMatrix = [
	[0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0],
	[0, 1, 0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0],
	[1, 0, 0, 0, 0, 0, 0],
];

//cyclic
const testMatrix2 = {
	A: ["B", "G"],
	B: ["C"],
	C: ["D"],
	D: ["E", "F"],
	G: ["A"],
};

//acyclic
const testMatrix3 = [
	[0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0],
	[0, 1, 0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
];

//cyclic
const testMatrix4 = {
	A: ["G"],
	B: ["A"],
	C: ["B"],
	D: ["C"],
	E: ["D"],
	F: ["D", "I"],
	H: ["F"],
	I: ["H"],
};

const testMatrix5 = {
	A: ["B"],
	B: ["C"],
	C: ["D"],
	D: ["E", "F"],
	G: ["A"],
};

const testMatrix6 = {
	A: ["G"],
	B: ["A"],
	C: ["B"],
	D: ["C"],
	E: ["D"],
	F: ["D", "I"],
	H: ["F"],
};

const grafo1 = new Graph(testMatrix);
const grafo2 = new Graph(testMatrix2);
const grafo3 = new Graph(testMatrix3);
const grafo4 = new Graph(testMatrix4);
const grafo5 = new Graph(testMatrix5);
const grafo6 = new Graph(testMatrix6);

console.log(grafo1);
console.log(grafo2);
console.log(grafo3);
console.log(grafo4);
console.log(grafo5);
console.log(grafo6);

console.log(grafo2.hasCycle());

console.log(grafo5.dependencySort());
