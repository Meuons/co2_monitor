
import { ValueContainer } from "./ValueContainer";
import { getData } from "../API/getData";
import * as React from "react";

import { stamp } from "../types";
import { useState, useEffect, CSSProperties } from "react";
import Graph from "./Graph";
import { StylesDictionary } from "../StylesDictionary";
const url = "https://co2-server-app.herokuapp.com/timestamps";

const styles: StylesDictionary = {
  wrapper: {
    position: "relative",

    width: "90vw",
    boxShadow: "black 10px 5px 5px",
    backgroundColor: "white",
    margin: 20,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  leftHeader: {
    position: "relative",
  },
  battery: {
    position: "relative",
  },
  values: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  online: {
    color: "green",
  },
  offline: {
    color: "red",
  },
};

export default function Device({ room  }: { room: string }) {
  const [roomData, setRoomData] = useState<[]>([]);
  const [currentData, setCurrentData] = useState<stamp| null>(null);
  const today = new Date();
  const sec = new Date().getSeconds();
  const fetch = () => {
    getData(url + '/date/' + today.toLocaleDateString('sv-SE') + '/room/' +  room , async (result: any) => {
      const { data, error } = result;

      setRoomData(data);
      setCurrentData(data[0] as stamp)
      if (error) {
        // Handle error
        return;
      }
    });
  };

  useEffect(() => {
    fetch();
    setTimeout(() => {
      setInterval(() => {
        fetch();
      }, 300000);
    }, (300 - sec) * 1000);
  }, []);
  return (
    <>
      {roomData.length < 1 ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
  
            <div>
              {currentData ? (
                   <div style={styles.wrapper}>
                   <div style={styles.header}>
                     <div style={styles.leftHeader}>
                       <h1>{currentData.room}</h1>
                   <div style={styles.values}>
                     <ValueContainer
                       title={"CO2"}
                       value={currentData.ppm_co2}
                       unit={"ppm"}
                       max={3000}
                     />
           
                   </div>
                   <Graph room={currentData.room} date={currentData.time} />
                 </div>
                 </div>
                 </div>
              ) : (
                <div>
                  <h1>No data found</h1>
                </div>
              )}
            </div>
        
        </div>
      )}
    </>
  );
}
