import React from 'react';
import './App.css';
import CytoscapeComponent from 'react-cytoscapejs';

const Network = () => {
  const elements = [
    { data: { id: 'a' } },
    { data: { id: 'b' } },
    {data: {id: 'c'}},
    {data: {id:'d'}},
    {data : {id:'ac',source:'a', target:'c'}},
    {data : {id:'cd',source:'c', target:'d'}},
    {data : {id:'ad',source:'a', target:'d'}},
    { data: { id: 'ab', source: 'a', target: 'b' } }
  ];

  const layout = {
    name: 'random',
  
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
    <div className='cytoscape-container '>
    <CytoscapeComponent 
      elements={elements} 
      style={{ width: '600px', height: '600px' }} 
      layout={layout} 
      stylesheet={style} 
    />
    </div>
  );
};


function App() {
  return (
    <div className="App">
      <Network />
    </div>
  );
}

export default App;
