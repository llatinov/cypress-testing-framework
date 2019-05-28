import React from 'react';
import Header from './common/header';

function App(props) {
  return (
    <div>
      <Header />
      <section className="m-3">{props.children}</section>
    </div>
  );
}

export default App;
