import React from "react";
import ReactDOM from "react-dom";
import Provider from "./containers/Provider";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider />
  </React.StrictMode>,
  document.getElementById("root")
);

