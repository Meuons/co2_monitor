import * as React from "react";
import Chart from "react-apexcharts";
import colors from "../colors";
import { dataObj, curveArr, ApexDatetime, dataNumArr, curveObj, CO2Arr } from "../types";
import { getData } from "../API/getData";
import { useEffect, useState } from "react";
import xAxis from "./xAxis";
export default function StackedGraph(props: { parameters: curveArr }) {
  const parameterData = props.parameters;

  const [chartData] = useState<dataNumArr>([]);
  const [count, setCount] = useState(0);
  const [options, setOptions] = useState<any>({});
  const colorArr: string[]= []
   const datetime: ApexDatetime = 'datetime'


  const fetch = (date: string, room: string, color: string) => {
    const url =
    "https://co2-server-app.herokuapp.com/timestamps/date/" +
    new Date(date).toLocaleDateString('sv-SE') +
    "/room/" +
    room;

    getData(url, async (result: any) => {
      const { data, error } = result;

      sortData(data, color);
      if (error) {
        // Handle error
        return;
      }
    });
  };

  useEffect(() => {
    parameterData.map((item: curveObj, i) => {

      fetch(new Date(item.date).toISOString().split("T")[0], item.name, item.color);
    });
  }, []);
  function sortData(data: CO2Arr, color: string) { 

    if (data) {
     const CO2Data: number[] = []

        data.map((item, i) => {
          if (item.ppm_co2 === 0 && i > 0) {
            item.ppm_co2 = data[i - 1].ppm_co2;
          }
          const hour = new Date(item.time).getHours()
          if(hour >= 9 && hour <= 17){
            CO2Data.push(item.ppm_co2)
          }
       
        });

  

      const obj: dataObj = {
        name: data[0].room + " " + data[0].time.split("T")[0],
        data: CO2Data,
      };
      console.log(obj)
      chartData.push(obj);
      colorArr.push(color)
      console.log(xAxis())
      if (chartData.length == parameterData.length) {
        setOptions(
        {
          chart: {
            height: 450,
            zoom: {
              autoScaleYaxis: true,
            },
            subtitle: {
              style: {
                fontSize: '200px'
              }
            },

            dropShadow: {
              enabled: true,
              color: "#000",
              top: 18,
              left: 7,
              blur: 10,
              opacity: 0.2,
            },
            toolbar: {
              show: true,
            },
          },
          colors: colorArr,
          dataLabels: {
            enabled: false,
          },

          grid: {
            borderColor: "#e7e7e7",
            row: {
              colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
              opacity: 0.5,
            },
          },
          xaxis: {
            type: datetime,
            categories: xAxis(),
            tooltip: {
              enabled: false
            }

          },
          tooltip: {
            x: {
              format: "HH:mm",
              style:{fontSize: '20px'}

            },
            style:{fontSize: '20px'}
          },
        }
        )
        setCount(count + 1);
      }
    }
  }



  return (
    <div key={count} style={{ width: "90vw" }}>
 
        <Chart
          options={options}
          series={chartData}
          type="area"
          height={350}
          width={"100%"}
        />
    
    </div>
  );
}
