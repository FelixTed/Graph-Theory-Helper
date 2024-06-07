import React, { useState } from 'react';
import './App.css';
import CytoscapeComponent from 'react-cytoscapejs';

// Network component to render the Cytoscape graph
const Network = ({ elements }) => {
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

  // Function to add a new node
  const addNode = () => {
    if (!nodeId.trim()) {
      setError('Node ID cannot be empty.');
      return;
    }
    setNodes([...nodes, { data: { id: nodeId.trim() } }]);
    setNodeId(''); // Clear the input field after adding
    setError(''); // Clear any previous error
  };

  // Function to add a new edge
  const addEdge = () => {
    if (!edgeSource.trim() || !edgeTarget.trim()) {
      setError('Edge Source and Target cannot be empty.');
      return;
    }
    if (!nodes.find(node => node.data.id === edgeSource.trim()) || 
        !nodes.find(node => node.data.id === edgeTarget.trim())) {
      setError('Both Edge Source and Target must be valid nodes.');
      return;
    }
    setEdges([...edges, { data: { id: `${edgeSource.trim()}${edgeTarget.trim()}`, source: edgeSource.trim(), target: edgeTarget.trim() } }]);
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
    const newNodes = vertexSet.split(',').map(v => ({ data: { id: v.trim() } }));
    setNodes([...nodes, ...newNodes]);
    setVertexSet(''); // Clear the input field after adding
    setError(''); // Clear any previous error
  };

  // Function to add a batch of edges
  let errorStatus = false;
  const addEdgeSet = () => {
    if (!edgeSet.trim()) {
      setError('Edge Set cannot be empty.');
      return;
    }
    const newEdges = edgeSet.slice(1, -1).split('),(').map(e => {
      const [source, target] = e.split(',').map(v => v.trim());
      if (!nodes.find(node => node.data.id === source) || !nodes.find(node => node.data.id === target)) {
        setError(`Invalid edge: (${source}, ${target}). Both nodes must exist.`);
        console.log("here");
        errorStatus = true;
        return null;
      }
      return { data: { id: `${source}${target}`, source, target } };
    }).filter(e => e !== null);
    setEdges([...edges, ...newEdges]);
    setEdgeSet(''); // Clear the input field after adding
    if(!errorStatus){
      setError(''); // Clear any previous error
    }
  };

  // Combine nodes and edges into one elements array
  const elements = [...nodes, ...edges];

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
      {/* Pass the elements to the Network component */}
      <Network elements={elements} />
    </div>
  );
}

export default App;
