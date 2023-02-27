import * as React from "react";

import { useState, CSSProperties, useEffect } from "react";
import { Home } from "../Views/Home";
import Archive from "../Views/Archive";
import { StylesDictionary } from "../StylesDictionary";
import "../App.css";
const styles: StylesDictionary = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navbar: {
    backgroundColor: "black",
    width: "100vw",
    position: "absolute",
    top: 0,
    padding: 20,
    margin: 0,
    marginBottom: 1000,
  },
  routeContainer: {
    position: "absolute",
    top: 200,
  },
  li: {
    float: "left",
    margin: 20,
  },
  linkArea: {
    float: "left",
    margin: 30,
  },
  link: {
    margin: 20,
    color: "white",
  },
};

export default function NavMenu() {
  const [atHome, setAtHome] = useState(true);

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <div style={styles.linkArea}>
          <span style={styles.link} onClick={() => setAtHome(true)}>
            Home
          </span>
          <span style={styles.link} onClick={() => setAtHome(false)}>
            Archive
          </span>
        </div>
      </div>
      <div style={styles.routeContainer}>{atHome ? <Home /> : <Archive />}</div>
    </div>
  );
}
