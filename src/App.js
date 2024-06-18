import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import CytoscapeComponent from 'react-cytoscapejs';
import { graphColoring } from './ChromaticNumber';
import { planarCheck } from './PlanarCheck';

const Network = ({ elements, cyRef }) => {
  const layout = {
    name: 'grid',
    fit: true,
    padding: 10,
    animate: true,
    animationDuration: 1000
  };

  const style = [
    {
      selector: 'node',
      style: {
        'border-color': '#000000',
        'border-width': 2,
        'background-color': '#FFFFFF',
        'label': 'data(id)'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#000000',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ];

  return (
    <div className='cytoscape-container'>
      <CytoscapeComponent
        cy={(cy) => { cyRef.current = cy }}
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        layout={layout}
        stylesheet={style}
      />
    </div>
  );
};

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [vertexSet, setVertexSet] = useState('');
  const [edgeSet, setEdgeSet] = useState('');
  const [error, setError] = useState('');
  const [adjacencyMatrix, setAdjacencyMatrix] = useState('');
  const [displaySet, setDisplaySet] = useState('');
  const [adjacencyList, setAdjacencyList] = useState([]);
  const [chromaticNumber, setChromaticNumber] = useState("");
  const [connectedComp, setConnectedComp] = useState([]);

  const cyRef = useRef(null);

  const [nodeCounter, setNodeCounter] = useState(1);
  const addNode = () => {
    // if (!nodeId.trim()) {
    //   setError('Node ID cannot be empty.');
    //   return;
    // }
    // if (!/^\d+$/.test(nodeId.trim())) {
    //   setError('Node ID must be a number.');
    //   return;
    // }
    const id = nodeCounter;
    setNodes([...nodes, { data: { id: id.toString() } }]);
    setAdjacencyList(prev => {
      const newList = [...prev];
      newList[id - 1] = [];
      return newList;
    });
    setError('');
    setNodeCounter(nodeCounter+1);
  };

  const addEdge = () => {
    if (!edgeSource.trim() || !edgeTarget.trim()) {
      setError('Edge Source and Target cannot be empty.');
      return;
    }
    if (!/^\d+$/.test(edgeSource.trim()) || !/^\d+$/.test(edgeTarget.trim())) {
      setError('Edge Source and Target must be numbers.');
      return;
    }
    const source = parseInt(edgeSource.trim());
    const target = parseInt(edgeTarget.trim());
    if (!nodes.find(node => node.data.id === source.toString()) || 
        !nodes.find(node => node.data.id === target.toString())) {
      setError('Both Edge Source and Target must be valid nodes.');
      return;
    }
    setEdges([...edges, { data: { id: `${source}${target}`, source: source.toString(), target: target.toString() } }]);
    setAdjacencyList(prev => {
      const newList = [...prev];
      newList[source - 1] = newList[source - 1] || [];
      newList[target - 1] = newList[target - 1] || [];
      if (!newList[source - 1].includes(target)) {
        newList[source - 1].push(target);
      }
      if (!newList[target - 1].includes(source)) {
        newList[target - 1].push(source);
      }
      return newList;
    });
    setEdgeSource('');
    setEdgeTarget('');
    setError('');
  };

  const addVertexSet = () => {
    if (!vertexSet.trim()) {
      setError('Vertex Set cannot be empty.');
      return;
    }
    const vertexSetPattern = /^[0-9]+(,[0-9]+)*$/;
    if (!vertexSetPattern.test(vertexSet.trim())) {
      setError('Invalid Vertex Set. Only numbers and commas are allowed.');
      return;
    }
    const newNodes = vertexSet.split(',').map(v => ({ data: { id: v.trim() } }));
    setNodes([...nodes, ...newNodes]);
    setAdjacencyList(prev => {
      const newList = [...prev];
      newNodes.forEach(node => {
        newList[node.data.id - 1] = [];
      });
      return newList;
    });
    setVertexSet('');
    setError('');
  };

  const addEdgeSet = () => {
    if (!edgeSet.trim()) {
      setError('Edge Set cannot be empty.');
      return;
    }
    const edgeSetPattern = /^\(\d+,\d+\)(,\(\d+,\d+\))*$/;
    if (!edgeSetPattern.test(edgeSet.trim())) {
      setError('Invalid Edge Set. Only numbers, commas, and parentheses are allowed.');
      return;
    }
    const newEdges = edgeSet.slice(1, -1).split('),(').map(e => {
      const [source, target] = e.split(',').map(v => v.trim());
      if (!nodes.find(node => node.data.id === source) || !nodes.find(node => node.data.id === target)) {
        setError(`Invalid edge: (${source}, ${target}). Both nodes must exist.`);
        return null;
      }
      return { data: { id: `${source}${target}`, source, target } };
    }).filter(e => e !== null);
    setEdges([...edges, ...newEdges]);
    setAdjacencyList(prev => {
      const newList = [...prev];
      newEdges.forEach(edge => {
        const sourceIndex = parseInt(edge.data.source) - 1;
        const targetIndex = parseInt(edge.data.target) - 1;
        if (!newList[sourceIndex].includes(parseInt(edge.data.target))) {
          newList[sourceIndex].push(parseInt(edge.data.target));
        }
        if (!newList[targetIndex].includes(parseInt(edge.data.source))) {
          newList[targetIndex].push(parseInt(edge.data.source));
        }
      });
      return newList;
    });
    setEdgeSet('');
    setError('');
  };

  const extractDisplaySet = () => {
    if (cyRef.current) {
      const nodeIds = cyRef.current.nodes().map(node => node.id());
      const edgeIds = cyRef.current.edges().map(edge => `${edge.data('source')},${edge.data('target')}`);
      setDisplaySet(`Node IDs: ${nodeIds.join(', ')} Edges: (${edgeIds.join('),(')})`);
    }
  };

  const extractAdjacencyMatrix = () => {
    if (!cyRef.current) return;

    const currentNodes = cyRef.current.nodes();
    const numNodes = currentNodes.length;
    const matrix = Array.from({ length: numNodes }, () => Array(numNodes).fill(0));

    currentNodes.forEach((sourceNode, i) => {
      currentNodes.forEach((targetNode, j) => {
        if (sourceNode.edgesWith(targetNode).length > 0) {
          matrix[i][j] = 1;
          matrix[j][i] = 1; // Since it's an undirected graph
        }
      });
    });

    setAdjacencyMatrix(matrix.map(row => row.join(' ')).join('\n'));
  };

  useEffect(() => {
    extractAdjacencyMatrix();
    extractDisplaySet();
    setConnectedComp(getConnectedComponents(adjacencyList));
    if (cyRef.current) {
      cyRef.current.layout({
        name: 'cose',
        fit: true,
        padding: 10,
        animate: true,
        animationDuration: 1000,
        randomize: false
      }).run();
    }
  }, [nodes, edges, adjacencyList]);

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setAdjacencyList([]);
    setAdjacencyMatrix('');
    setDisplaySet('');
    setChromaticNumber('');
    setConnectedComp([]);
  };

  const findChromaticNumber = () => {
    setChromaticNumber(graphColoring(adjacencyList, 100));
  };

  const elements = [...nodes, ...edges];

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
                  component.push(current + 1); // Convert back to one-indexed for the result
                  try{
                  for (let neighbor of adjacencyList[current]) {
                      if (!visited.has(neighbor - 1)) {
                          stack.push(neighbor - 1); // Convert to zero-indexed for accessing adjacency list
                      }
                  }
                }catch(err){
                  setError("Invalid Vertex set, reset graph");
                  clearGraph();
                  return;
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

  return (
    <div className="App">
      <div className="Input-container">
      <h1 className='App-text'>GRAPH THEORY CALCULATOR</h1>
      {error && <div className="error">{error}</div>}
      <div>
        <button onClick={addNode}>Add Node</button>
      </div>
      <div>
        <input
          type="text"
          value={edgeSource}
          onChange={(e) => setEdgeSource(e.target.value)}
          placeholder="Edge Source"
        />
        <input
          type="text"
          value={edgeTarget}
          onChange={(e) => setEdgeTarget(e.target.value)}
          placeholder="Edge Target"
        />
        <button onClick={addEdge}>Add Edge</button>
      </div>
      <div>
        <input
          type="text"
          value={vertexSet}
          onChange={(e) => setVertexSet(e.target.value)}
          placeholder="Vertex Set"
        />
        <button onClick={addVertexSet}>Add Vertex Set</button>
        <label className='App-text'>ex: 1, 2, 3</label>
      </div>
      <div>
        <input
          type="text"
          value={edgeSet}
          onChange={(e) => setEdgeSet(e.target.value)}
          placeholder="Edge Set"
        />
        <button onClick={addEdgeSet}>Add Edge Set</button>
        <label className='App-text'>ex: (1,2), (2,3), (1,3)</label>
      </div>
      <button onClick={clearGraph}>Clear Graph</button>
      <div>
        <pre>{displaySet}</pre>
      </div>
      <pre>Adjacency Matrix:{'\n' + adjacencyMatrix}</pre>
      <pre>Is Planar?: {((planarCheck(edges,nodes)) ? 'Potentially, try to find planar representation to be certain' : 'Not planar')}</pre>
      <div>
        <button onClick={findChromaticNumber}>Chromatic Number:</button>
        <label className='App-text'>{chromaticNumber}</label>
      </div>
      <pre>{JSON.stringify(connectedComp, null, 2)}</pre>
    </div>
      <Network elements={elements} cyRef={cyRef} />
    </div>
  );
}

export default App;
