// Function to check if it's safe to color a vertex with a given color
function isSafe(v, graph, color, c) {
    for (let neighbor of graph[v - 1]) { // Adjust index for 1-based adjacency list
        if (color[neighbor - 1] === c) { // Adjust index for 1-based adjacency list
            return false; // If any adjacent vertex has the same color, it's not safe
        }
    }
    return true;
}

// Backtracking function to find a valid coloring
function graphColoringUtil(v, graph, color, m) {
    if (v === graph.length + 1) { // Adjust for 1-based adjacency list
        return true; // All vertices are colored, a solution is found
    }

    for (let c = 1; c <= m; ++c) {
        if (isSafe(v, graph, color, c)) {
            color[v - 1] = c; // Adjust index for 1-based adjacency list

            // Recur for the next vertices
            if (graphColoringUtil(v + 1, graph, color, m)) {
                return true;
            }

            // Backtrack
            color[v - 1] = 0; // Adjust index for 1-based adjacency list
        }
    }

    return false; // No solution found for this coloring
}

// Main function to find chromatic number
function graphColoring(graph, m) {
    const n = graph.length;
    const color = new Array(n).fill(0);

    if (!graphColoringUtil(1, graph, color, m)) { // Start with the first vertex (1-based index)
        console.log("No feasible solution exists");
        return 0;
    }

    // Print the solution
    let result = "Vertex colors: ";
    for (let c of color) {
        result += c + " ";
    }
    console.log(result);

    // Count unique colors to determine chromatic number
    const uniqueColors = new Set(color);
    return uniqueColors.size;
}

export { graphColoring };
