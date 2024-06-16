function getConnectedComponents(adjacencyList){
    let visited = [];
    let stack = [];
    let connectedComponents = [];
    for(let i = 0; i<adjacencyList.length; i++){
        if(!visited.includes(i+1)){
            connectedComponents.push(visited);
            visited = 0;
            visited.push(i+1);
            DFS(visited,stack);
        }
    }
    connectedComponents.push(visited);
}
function DFS(visited,stack,adjacencyList){
    for(let j = 0; j < adjacencyList[visited[visited.length-1]].length; j++){
        if(!visited.includes(adjacencyList[visited[visited.length-1]][j]))
            stack.push(adjacencyList[visited[visited.length-1]][j]);
    }
     visited.push(stack.pop());
     if(stack.length === 0)
        return visited;
    else
        DFS(visited,stack,adjacencyList);
}

export {getConnectedComponents};