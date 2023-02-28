import * as React from "react";
import Chart from "react-apexcharts";
import colors from "../colors";
import { dataObj, curveArr, ApexDatetime, dataNumArr, curveObj, ECO2Arr } from "../types";
import { getData } from "../API/getData";
import { useEffect, useState } from "react";

export default function StackedGraph(props: { parameters: curveArr }) {
  const parameterData = props.parameters;

  const [chartData] = useState<dataNumArr>([]);
  const [count, setCount] = useState(0);
  const [options, setOptions] = useState<any>({});
  const colorArr: string[]= []
   const datetime: ApexDatetime = 'datetime'
  const xAxis = () => {
    const arr = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j++) {
        if (i < 10 && j < 10) {
          arr.push("2018-09-19T0" + i + ":" + "0" + j + ":00.000Z");
        } else if (i > 9 && j < 10) {
          arr.push("2018-09-19T" + i + ":" + "0" + j + ":00.000Z");
        } else if (i < 10 && j > 9) {
          arr.push("2018-09-19T0" + i + ":" + j + ":00.000Z");
        } else {
          arr.push(`2018-09-19T${i}:${j}:00.000Z`);
        }
      }
    }
    return arr;
  };

  const fetch = (date: string, name: string, color: string) => {
    const url =
      "https://co2-server-app.herokuapp.com/timestamps/date/" +
      date +
      "/name/" +
      name;

    getData(url, async (result: any) => {
      const { data, error } = result;

      sortData(data.set, color);
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
  function sortData(data: ECO2Arr, color: string) {
    if (data) {
      const mapCO2 = () =>
        data.map((item, i) => {
          if (item.ECO2 === 0 && i > 0) {
            item.ECO2 = data[i - 1].ECO2;
          }

          return item.ECO2;
        });

      const CO2Data = mapCO2();
      const obj: dataObj = {
        name: data[0].DeviceName + " " + data[0].StampDate.split("T")[0],
        data: CO2Data,
      };
      chartData.push(obj);
      colorArr.push(color)
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
      {chartData.length != parameterData.length ? (
        <div>
          <h1>Loading chart...</h1>
        </div>
      ) : (
        <Chart
          options={options}
          series={chartData}
          type="area"
          height={350}
          width={"100%"}
        />
      )}
    </div>
  );
}
