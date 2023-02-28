import * as React from "react";
import functionPlot from "function-plot";
import {curveYObj, curveArr, dateObj, curveObj, deviceObj} from "../types";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {ECO2Arr} from "../types";
import colors from "../colors";
// @ts-ignore
import PolynomialRegression from "ml-regression-polynomial";
import { prototype } from "apexcharts";

export default function Curve(props: { parameters: curveArr}) {
  const parameterData = props.parameters;


  const getData = (url: string, callback: any) => {
    axios
        .get(url)
        .then((res) => callback({ data: res.data }))
        .catch((err) => callback({ error: err }));
  };





  const [count, setCount] = useState(0);


  const [equations, setEquations] = useState<{ fn: string, maxY: number, color: string }[]>([]);

  const [yMax, setYmax] = useState(0)

  const xValues = (minuteCount: number) => {
    const arr = [];



    for (let i = 0; i < minuteCount; i++) {
      arr.push(i);
    }


    return arr;
  };
  const derive = (equation: { coefficients: any[] }) => {
    let newEquation = 0;
    equation.coefficients.map((item, index) => {});
  };
  const fetch = () => {
    parameterData.map((item:curveObj, i)=> {

          const url = "https://co2-server-app.herokuapp.com/timestamps/date/" + item.date + "/name/" + item.name

          getData(url, async (result: any) => {

            const { data, error } = result;
            if(data){

              getY(data.set, item.startHour, item.endHour, i);
            }


            if (error) {
              // Handle error
              return;
            }
          });
        }


    )
  };

  const getY = (data: ECO2Arr, start: number, end: number , i: number) => {
    const y: number[] = [];

    data.map((item: curveYObj, i) => {
      if (start != null && end != null) {
        if (
            new Date(item.StampDate).getHours() >
            start &&
            new Date(item.StampDate).getHours() < end + 1
        ) {

          if(item.ECO2 == 0){
            y.push(data[i-1].ECO2)

          } else{
            y.push(item.ECO2)
          }
        }
      }
    });
    const x = xValues(y.length)


    if (x.length == y.length) {





      equations.push({fn: new PolynomialRegression(x,y,
            2).toString().slice(6), maxY: Math.max(...y) , color: colors[i]}); // Prints a human-readable version of the function.

      plotGraph(x.length, Math.max(...equations.map(o => o.maxY)))


    }
  };
  const plotGraph = (xMax: number, yMax: number) => {


    if(equations.length > 0){

      functionPlot({
        target: "#curve" ,
        width: 700,
        height: 700,

        yAxis: {
          label: "y axis",
          domain: [0, yMax],
        },
        xAxis: {
          label: "x axis",
          domain: [0, xMax],
        },
        data: equations,
        disableZoom: true,
        grid: true,
      });

      if(equations.length == parameterData.length){
        console.log(equations.length)
        console.log(parameterData.length)
setCount(count +1)
      }
    }
  }
  useEffect(() => {
    fetch()
  },[])

  return (
      <div style={{  display: 'flex',
        justifyContent: 'center'}}>
        <div key={count}>
          <ul>
            {equations.map((item: any, i: number) => (
                <li style={{color: item.color}}>
                  <span style={{fontSize: 15, color: 'black'}}>{item.fn}</span>
                </li>
            ))}

          </ul>
        </div>
        <div id={"curve"} ></div>

      </div>
  );
}