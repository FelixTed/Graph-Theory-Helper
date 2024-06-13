// Function to initialize a graph with an adjacency list
function initializeGraph(adjList) {
    return {
        V: adjList.length,
        adjListArray: adjList
    };
}

// Function to add an edge to an undirected graph
function addEdge(graph, src, dest) {
    graph.adjListArray[src].push(dest);
    graph.adjListArray[dest].push(src);
}

// Function to perform a DFS and mark all reachable vertices
function DFSUtil(graph, v, visited, component) {
    visited[v] = true;
    component.push(v);

    for (let x = 0; x < graph.adjListArray[v].length; x++) {
        let neighbor = graph.adjListArray[v][x];
        if (!visited[neighbor]) {
            DFSUtil(graph, neighbor, visited, component);
        }
    }
}

// Function to find all connected components in the graph
function connectedComponents(adjList) {
    const graph = initializeGraph(adjList);

    let visited = new Array(graph.V).fill(false);
    let components = [];

    for (let v = 1; v < graph.V; ++v) {
        if (!visited[v]) {
            let component = [];
            DFSUtil(graph, v, visited, component);
            components.push(component);
        }
    }

    return components;
}
export {connectedComponents}