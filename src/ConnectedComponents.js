function getConnectedComponents(adjacencyList) {
    let visited = new Set(); // Using a Set to track visited nodes
    let connectedComponents = [];

    // Helper function to perform DFS
    function DFS(node, component) {
        let stack = [node];
        while (stack.length > 0) {
            let current = stack.pop();
            if (!visited.has(current)) {
                visited.add(current);
                component.push(current);
                for (let neighbor of adjacencyList[current]) {
                    if (!visited.has(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
        }
    }

    // Iterate over each node in the adjacency list
    for (let i = 0; i < adjacencyList.length; i++) {
        if (!visited.has(i)) {
            let component = [];
            DFS(i, component);
            connectedComponents.push(component);
        }
    }

    return connectedComponents;
}
export {getConnectedComponents};