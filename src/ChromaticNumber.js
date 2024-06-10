// Function to find the chromatic number 
// using the greedy coloring algorithm
export function greedyColoring(graph) {
	const n = graph.length;
	const colors = new Array(n).fill(-1);

	for (let v = 0; v < n; ++v) {
		const usedColors = new Set();

		// Check neighbors and mark 
		// their colors as used
		for (const neighbor of graph[v]) {
			if (colors[neighbor] !== -1) {
				usedColors.add(colors[neighbor]);
			}
		}

		// Find the smallest available
		// color
		let color = 1;
		while (true) {
			if (!usedColors.has(color)) {
				colors[v] = color;
				break;
			}
			color++;
		}
	}

	// Find the maximum color used
	// (chromatic number)
	const chromaticNumber = Math.max(...colors) + 1;
	return chromaticNumber;
}