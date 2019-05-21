import React from 'react';
import Header from './common/header';

function App(props) {
  return (
    <div className="App">
      <Header />
      <body>{props.children}</body>
    </div>
  );
}

export default App;
