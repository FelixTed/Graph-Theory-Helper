import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import CytoscapeComponent from 'react-cytoscapejs';
import { graphColoring } from './ChromaticNumber';
import { planarCheck } from './PlanarCheck';

// Network component to render the Cytoscape graph
const Network = ({ elements, cyRef }) => {
  // Layout configuration for Cytoscape
  const layout = {
    name: 'grid', // Change to 'grid' or 'cose' to test different layouts
    fit: true, // Whether to fit the viewport to the graph
    padding: 10, // Padding around the layout
    animate: true, // Whether to animate the layout
    animationDuration: 1000 // Duration of the animation in milliseconds
  };

  // Style configuration for nodes and edges in Cytoscape
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

  // Render the Cytoscape graph
  return (
    <div className='cytoscape-container'>
      <CytoscapeComponent
        cy={(cy) => { cyRef.current = cy }}
        elements={elements}
        style={{ width: '600px', height: '600px' }}
        layout={layout}
        stylesheet={style}
      />
    </div>
  );
};

// Main App component
function App() {
  // State to hold nodes and edges
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // State for individual input fields
  const [nodeId, setNodeId] = useState('');
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');

  // State for batch input fields
  const [vertexSet, setVertexSet] = useState('');
  const [edgeSet, setEdgeSet] = useState('');

  // State for error messages
  const [error, setError] = useState('');

  // State for adjacency matrix
  const [adjacencyMatrix, setAdjacencyMatrix] = useState('');
  // State for display of vertex set and edge set 
  const [displaySet, setDisplaySet] = useState('');

  // State for adjacency list
  const [adjacencyList, setAdjacencyList] = useState([]);

  const [chromaticNumber,setChromaticNumber] = useState("");

  // Ref for Cytoscape instance
  const cyRef = useRef(null);

  // Function to add a new node
  const addNode = () => {
    if (!nodeId.trim()) {
      setError('Node ID cannot be empty.');
      return;
    }
    // Ensure nodeId contains only numbers
    if (!/^\d+$/.test(nodeId.trim())) {
      setError('Node ID must be a number.');
      return;
    }
    setNodes([...nodes, { data: { id: nodeId.trim() } }]);
    setAdjacencyList(prev => {
      const newList = [...prev];
      newList[nodeId.trim() - 1] = [];
      return newList;
    });
    setNodeId(''); // Clear the input field after adding
    setError(''); // Clear any previous error
  };

  // Function to add a new edge
  const addEdge = () => {
    if (!edgeSource.trim() || !edgeTarget.trim()) {
      setError('Edge Source and Target cannot be empty.');
      return;
    }
    // Ensure edgeSource and edgeTarget contain only numbers
    if (!/^\d+$/.test(edgeSource.trim()) || !/^\d+$/.test(edgeTarget.trim())) {
      setError('Edge Source and Target must be numbers.');
      return;
    }
    if (!nodes.find(node => node.data.id === edgeSource.trim()) || 
        !nodes.find(node => node.data.id === edgeTarget.trim())) {
      setError('Both Edge Source and Target must be valid nodes.');
      return;
    }
    setEdges([...edges, { data: { id: `${edgeSource.trim()}${edgeTarget.trim()}`, source: edgeSource.trim(), target: edgeTarget.trim() } }]);
    setAdjacencyList(prev => {
      const newList = [...prev];
      const sourceIndex = edgeSource.trim() - 1;
      const targetIndex = edgeTarget.trim() - 1;
      if (!newList[sourceIndex].includes(parseInt(edgeTarget.trim()))) {
        newList[sourceIndex].push(parseInt(edgeTarget.trim()));
      }
      if (!newList[targetIndex].includes(parseInt(edgeSource.trim()))) {
        newList[targetIndex].push(parseInt(edgeSource.trim()));
      }
      return newList;
    });
    setEdgeSource(''); // Clear the input fields after adding
    setEdgeTarget('');
    setError(''); // Clear any previous error
  };

  // Function to add a batch of nodes
  const addVertexSet = () => {
    if (!vertexSet.trim()) {
      setError('Vertex Set cannot be empty.');
      return;
    }
    // Regular expression to allow only numbers and commas
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
    setVertexSet(''); // Clear the input field after adding
    setError(''); // Clear any previous error
  };
  

  // Function to add a batch of edges
  const addEdgeSet = () => {
    if (!edgeSet.trim()) {
      setError('Edge Set cannot be empty.');
      return;
    }
    // Regular expression to allow only numbers, commas, and parentheses
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
        const sourceIndex = edge.data.source - 1;
        const targetIndex = edge.data.target - 1;
        if (!newList[sourceIndex].includes(parseInt(edge.data.target))) {
          newList[sourceIndex].push(parseInt(edge.data.target));
        }
        if (!newList[targetIndex].includes(parseInt(edge.data.source))) {
          newList[targetIndex].push(parseInt(edge.data.source));
        }
      });
      return newList;
    });
    setEdgeSet(''); // Clear the input field after adding
    setError(''); // Clear any previous error
  };

  // Function to extract vertex set and edge set for display on the UI
  const extractDisplaySet = () => {
    if (cyRef.current) {
      const nodeIds = cyRef.current.nodes().map(node => node.id());
      const edgeIds = cyRef.current.edges().map(edge => `${edge.id()[0]},${edge.id()[1]}`);
      setDisplaySet(`Node IDs: ${nodeIds.join(', ')} Edges: (${edgeIds.join('),(')})`);
    }
  };
  const extractAdjacencyMatrix = () => {
    if (!cyRef.current) return;

    let currentNodes = cyRef.current.nodes();
    let numNodes = currentNodes.length;
    let aMatrix = Array.from({ length: numNodes }, () => Array(numNodes).fill(0));
  
    for (let i = 0; i < numNodes; i++) {
      for (let j = 0; j < numNodes; j++) {
        if (i === j) continue; // Skip self-loops
  
        // Check if there is an edge between node i and node j
        let sourceNode = currentNodes[i];
        let targetNode = currentNodes[j];
        let hasEdge = sourceNode.edgesWith(targetNode).length > 0;
  
        if (hasEdge) {
          aMatrix[i][j] = 1;
          aMatrix[j][i] = 1; // Since it's an undirected graph
        }
      }
    }
  
    setAdjacencyMatrix(aMatrix.map(row => row.join(' ')).join('\n'));
  }

  useEffect(() => {
    extractAdjacencyMatrix();
    extractDisplaySet();
    if (cyRef.current) {
      cyRef.current.layout({
        name: 'cose', // Same layout as defined in the Network component
        fit: true,
        padding: 10,
        animate: true,
        animationDuration: 1000,
        randomize: false
      }).run();
    }
  }, [nodes, edges]);

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setAdjacencyList([]);
    setAdjacencyMatrix('');
    setDisplaySet('');
    setChromaticNumber('');
  }

  const findChromaticNumber = () => {
      setChromaticNumber(graphColoring(adjacencyList, 100));
  }

  // Combine nodes and edges into one elements array
  const elements = [...nodes, ...edges];

  console.log(nodes);
  console.log(edges);

  // Render the app
  return (
    <div className="App">
      <h1>GRAPH THEORY CALCULATOR</h1>
      {error && <div className="error">{error}</div>}
      <div>
        <input
          type="text"
          value={nodeId}
          onChange={(e) => setNodeId(e.target.value)}
          placeholder="Vertex ID"
        />
        <button onClick={addNode}>Add Vertex</button>
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
        <label>ex: 1, 2, 3</label>
      </div>
      <div>
        <input
          type="text"
          value={edgeSet}
          onChange={(e) => setEdgeSet(e.target.value)}
          placeholder="Edge Set"
        />
        <button onClick={addEdgeSet}>Add Edge Set</button>
        <label>ex: (1,2), (2,3), (1,3)</label>
      </div>
      <button onClick={clearGraph}>Clear Graph</button>
      <div>
        <pre>{displaySet}</pre>
      </div>
      <pre>{adjacencyMatrix}</pre>
      <pre>Is Planar?: {((planarCheck(edges,nodes)) ? 'Potentially, try to find planar representation to be certain' : 'Not planar')}</pre>
      <div>
        <button onClick={findChromaticNumber}>Chromatic Number:</button>
        <label>{chromaticNumber}</label>
      </div>      
      {/* Pass the elements to the Network component */}
      <Network elements={elements} cyRef={cyRef} />
    </div>
  );
}

export default App;
