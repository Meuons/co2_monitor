import * as React from "react";
import { useState, useEffect } from "react";
import {
  ApexXAxisType,
  ApexChartType,
  ApexCurveType,
  ApexLegend,
  dataPointArr,
  CO2Arr,
} from "../types";
import Chart from "react-apexcharts";
import xAxis from "./xAxis";
import { getData } from "../API/getData";
import { ApexDatetime } from "../types";
export default function Graph(param: { date: string; room: string}) {
  const [chartData, setChartData] = useState<dataPointArr>([]);
  const datetime: ApexDatetime = 'datetime'
  const [roomData, setRoomData] = useState<CO2Arr>([]);
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
    new Date(param.date).toLocaleDateString('en-ca') +
    "/room/" +
    param.room;
  const fetch = () => {
    getData(url, async (result: any) => {
      const { data, error } = result;
      setRoomData(data);
      if (error) {
        // Handle error
        return;
      }
    });
  };
  useEffect(() => {
    async function sortData() {
      if (roomData) {
        const CO2Data: {x: number, y: number}[] = []
        roomData.map((item, i) => {
          if (item.ppm_co2 === 0 && i > 0) {
            item.ppm_co2 = roomData[i - 1].ppm_co2;
          }
          const date = new Date(item.time)
           date.setHours(date.getHours() + 2);
          const hour = date.getHours()

          if(hour >= 11 && hour <= 18){
            const obj = {x: date.getTime(), y: item.ppm_co2}
            CO2Data.push(obj)
          }
       
        });

  

        const getMinuteDerivative = (i: number) => {
          if (i > 0 && i < roomData.length - 1) {
            const y1 = roomData[i - 1].ppm_co2;
            const y2 = roomData[i + 1].ppm_co2;

            const Ydiff = y2 - y1;
            const d = Ydiff / 2;

            return d;
          } else {
            return 0;
          }
        };

        const mapMinuteD = async () =>
        roomData.map((item, i) => ({
            x: new Date(item.time).getTime(),
            y: Math.round(getMinuteDerivative(i)),
          }));

       
        const minuteD = await mapMinuteD();

        setChartData([
      
          {
            name: "CO2",
            data: CO2Data,
          },
        ]);
      }
    }
    sortData();
  }, [roomData]);

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
  };

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', justifyItems: 'center' }}>
      {chartData.length > 0 ? (
        <div style={{width: '90vw'}}>
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
