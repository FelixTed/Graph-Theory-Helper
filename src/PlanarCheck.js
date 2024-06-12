//This doesnt check planarity in a definitive way, if the condition is false, then the graph is surely not planar, but if the condition is true, then the graph may or may not be planar
function planarCheck(edgeSet,vertexSet){
    if(vertexSet === null)
        return false;
    if(edgeSet === null)
        return true;
    if(3*(vertexSet.length) - edgeSet.length >= 6)
        return true;
    return false;
}
export {planarCheck};