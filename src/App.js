import React from 'react';
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
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  
  // State for individual input fields
  const [nodeId, setNodeId] = React.useState('');
  const [edgeSource, setEdgeSource] = React.useState('');
  const [edgeTarget, setEdgeTarget] = React.useState('');

  // State for batch input fields
  const [vertexSet, setVertexSet] = React.useState('');
  const [edgeSet, setEdgeSet] = React.useState('');

  // Function to add a new node
  const addNode = () => {
    setNodes([...nodes, { data: { id: nodeId } }]);
    setNodeId(''); // Clear the input field after adding
  };

  // Function to add a new edge
  const addEdge = () => {
    setEdges([...edges, { data: { id: `${edgeSource}${edgeTarget}`, source: edgeSource, target: edgeTarget } }]);
    setEdgeSource(''); // Clear the input fields after adding
    setEdgeTarget('');
  };

  // Function to add a batch of nodes
  const addVertexSet = () => {
    const newNodes = vertexSet.split(',').map(v => ({ data: { id: v.trim() } }));
    setNodes([...nodes, ...newNodes]);
    setVertexSet(''); // Clear the input field after adding
  };

  // Function to add a batch of edges
  const addEdgeSet = () => {
    const newEdges = edgeSet.slice(1, -1).split('),(').map(e => {
      const [source, target] = e.split(',').map(v => v.trim());
      return { data: { id: `${source}${target}`, source, target } };
    });
    setEdges([...edges, ...newEdges]);
    setEdgeSet(''); // Clear the input field after adding
  };

  // Combine nodes and edges into one elements array
  const elements = [...nodes, ...edges];

  // Render the app
  return (
    <div className="App">
      <h1>GRAPH THEORY CALCULATOR</h1>
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
