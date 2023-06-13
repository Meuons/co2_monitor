import * as React from "react";
import NavMenu from "./Components/NavMenu";

import StackedGraph from "./Components/StackedGraph";

import "./App.css";
import { useState } from "react";
import { dateArr } from "./types";

function App() {
  return (
    <div className="App">
      <div className="Wrapper">
        <NavMenu />
      </div>
    </div>
  );
}

export default App;
