import React from 'react';
import './App.css';
import CytoscapeComponent from 'react-cytoscapejs';

// Network component to render the Cytoscape graph
const Network = ({ elements }) => {
  // Layout configuration for Cytoscape
  const layout = {
    name: 'random',
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
  
  // State for input fields
  const [nodeId, setNodeId] = React.useState('');
  const [edgeSource, setEdgeSource] = React.useState('');
  const [edgeTarget, setEdgeTarget] = React.useState('');

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
          type = "text"
          placeholder="Vertex Set"
        />
        <button>Add Vertex Set</button>
      </div>
      <div>
        <input
          type = "text"
          placeholder='Edge Set'
        />
        <button>Add Edge Set</button>
      </div>
      {/* Pass the elements to the Network component */}
      <Network elements={elements} />
    </div>
  );
}

export default App;
