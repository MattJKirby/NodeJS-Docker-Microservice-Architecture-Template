import React from "react";
import ReactDOM from "react-dom";
import BasicCounter from "./BasicCounter";

import "./index.css";

const App = () => (
  <div className="home__container" style={{border: "1px solid red"}}>
    <div>Name: mfe-home-service</div>
    <BasicCounter/>
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
