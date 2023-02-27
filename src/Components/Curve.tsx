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
console.log(JSON.stringify(parameterData))

  const getData = (url: string, callback: any) => {
    axios
      .get(url)
      .then((res) => callback({ data: res.data }))
      .catch((err) => callback({ error: err }));
  };




  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const degree = useState(2);
  const [domain, setDomain] = useState(0);
  const [showCurve, setShowCurve] = useState(false);
  const [regression, setRegression] = useState<{ coefficients: any[] }>(
    new PolynomialRegression(
      [50, 50, 50, 70, 70, 70, 80, 80, 80, 90, 90, 90, 100, 100, 100],
      [
        3.3, 2.8, 2.9, 2.3, 2.6, 2.1, 2.5, 2.9, 2.4, 3.0, 3.1, 2.8, 3.3, 3.53,
        3,
      ],
      degree
    )
  );
  const [equations, setEquations] = useState<{ fn: string, color: string }[]>([]);



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
          2).toString().slice(6), color: colors[i]}); // Prints a human-readable version of the function.

      plotGraph(x.length)
      setCount(count + 1);
    }
  };
const plotGraph = (domain: number) => {
    if(equations.length > 0){
console.log(equations)
    functionPlot({
      target: "#curve" ,
      width: 1000,
      height: 1000,

      yAxis: {
        label: "y axis",
        domain: [0, 1000],
      },
      xAxis: {
        label: "x axis",
        domain: [0, domain],
      },
      data: equations,
      disableZoom: true,
      grid: true,
    });

    }
  }
  useEffect(() => {
    fetch()
  },[])

  return (
    <div>

      <div id={"curve"} ></div>

    </div>
  );
}
