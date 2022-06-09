import React from "react";
import ReactDOM from "react-dom";
import BasicCounter from 'home/BasicCounter'

import "./index.css";

export const App = () => (
  <div className="container">
    <h1>Host micro-frontend</h1>
    <div>Name: host</div>
    <div>Framework: react</div>
    <div>Language: TypeScript</div>
    <div>CSS: Empty CSSX</div>
    <BasicCounter></BasicCounter>
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
