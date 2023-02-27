import * as React from "react";
import { useState, useEffect } from "react";
import {
  ApexXAxisType,
  ApexChartType,
  ApexCurveType,
  ApexLegend,
  dataPointArr,
  ECO2Arr,
} from "../types";
import Chart from "react-apexcharts";

import { getData } from "../API/getData";
import Curve from "./Curve";
export default function Graph(param: { date: string; name: string}) {
  const [chartData, setChartData] = useState<dataPointArr>([]);

  const [data, setData] = useState<ECO2Arr>([]);
  const sec = new Date().getSeconds();
  const dateTime: ApexXAxisType = "datetime";
  const line: ApexChartType = "line";
  const smooth: ApexCurveType = "smooth";
  const legend: ApexLegend = {
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: -25,
    offsetX: -5,
  };

  const url =
    "https://co2-server-app.herokuapp.com/timestamps/date/" +
    param.date +
    "/name/" +
    param.name;
  const fetch = () => {
    getData(url, async (result: any) => {
      const { data, error } = result;
      setData(data.set);
      if (error) {
        // Handle error
        return;
      }
    });
  };
  useEffect(() => {
    async function sortData() {
      if (data) {
        const getMinuteDerivative = (i: number) => {
          if (i > 0 && i < data.length - 1) {
            const y1 = data[i - 1].ECO2;
            const y2 = data[i + 1].ECO2;

            const Ydiff = y2 - y1;
            const d = Ydiff / 2;

            return d;
          } else {
            return 0;
          }
        };
        const mapCO2 = async () =>
          data.map((item, i) => {
            if (item.ECO2 === 0 && i > 0) {
              item.ECO2 = data[i - 1].ECO2;
            }

            const obj = { x: new Date(item.StampDate).getTime(), y: item.ECO2 };
            return obj;
          });
        const mapMinuteD = async () =>
          data.map((item, i) => ({
            x: new Date(item.StampDate).getTime(),
            y: Math.round(getMinuteDerivative(i)),
          }));

        const CO2Data = await mapCO2();
        const minuteD = await mapMinuteD();

        setChartData([
          {
            name: "d",
            data: minuteD,
          },
          {
            name: "ECO2",
            data: CO2Data,
          },
        ]);
      }
    }
    sortData();
  }, [data]);

  useEffect(() => {
    fetch();
    setTimeout(() => {
      setInterval(() => {
        fetch();
      }, 60000);
    }, (60 - sec) * 1000);
  }, []);

  const options = {
    chart: {
      height: 450,
      type: line,
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
    colors: ["#77B6EA", "#545454"],
    stroke: {
      curve: smooth,
    },

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
      type: dateTime,
      labels: {
        formatter: function (val: any) {
          return new Date(val).toLocaleTimeString("sv-SE", {
            timeZone: "Europe/London",
            hour: "numeric",
            minute: "numeric",
          });
        },
      },
    },
    yaxis: {
      title: {
        text: "PPM ECO2",
      },

      min: 350,
    },
    legend: legend,
  };

  return (
    <div style={{ width: "90vw" }}>
      {chartData.length > 0 ? (
        <div>
          <Chart
            options={options}
            series={chartData}
            type="area"
            height={350}
            width={"100%"}
          />

        </div>
      ) : (
        <div>
          <h1>Loading chart...</h1>
        </div>
      )}
    </div>
  );
}
