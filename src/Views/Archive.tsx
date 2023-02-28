import Device from "../Components/Device";
import * as React from "react";
import { useState, useRef, CSSProperties, useEffect } from "react";
import { curveArr, curveObj } from "../types";
import DatePicker from "react-datepicker";
import Curve from "../Components/Curve";
import StackedGraph from "../Components/StackedGraph";
import "react-datepicker/dist/react-datepicker.css";
import { StylesDictionary } from "../StylesDictionary";
import _ from "lodash";
import colors from '../colors'
export default function Archive() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const [count, setCount] = useState(0);
  const [curveCount, setCurveCount] = useState(0);

  const [selects, setSelects] = useState<curveArr>([
    { name: "mill_1", date: date.toISOString().split("T")[0], startHour: 8, endHour: 10  },
  ]);

  const styles: StylesDictionary = {
    wrapper: {
      position: "relative",
      width: "90vw",
      boxShadow: "black 10px 5px 5px",
      backgroundColor: "white",
      margin: 20,
    },
    selectsArea: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    selectContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 20,
      width: "5%",
      backgroundColor: "#f8f9fa",
      padding: 30,
      borderRadius: 10,
      minWidth: 200,
    },
    xBtn: {
      position: "relative",
      bottom: 25,
      left: 20,
      backgroundColor: "#F00",
      color: "#fff",
    },
    dateSelect: {
      width: 80,

    },
    nameSelect: {
      fontSize: "1rem",
    },
  };
  // @ts-ignore

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    // @ts-ignore
    <button style={styles.dateSelect} onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  const addSelects = (obj: curveObj) => {
    const arr = selects.concat([obj]);
    setSelects(arr);
    setCount(count + 1);
    setCurveCount(curveCount + 1)
  };

  const handleStartInput = (hour: number, id: number ) => {
   const arr = selects

    if(arr[id].endHour > hour) {
      arr[id].startHour = hour
      setSelects(arr)
      setCurveCount(curveCount + 1)
    }

  };
  const handleEndInput = (hour: number, id: number ) => {
    const arr = selects
    if(arr[id].startHour < hour){
    arr[id].endHour = hour
    setSelects(arr)
      setCurveCount(curveCount  +1)
    }
  };
  const deleteSelects = (i: number) => {
    const arr = selects;
    arr.splice(i, 1);
    setSelects(arr);
    setCount(count + 1);
    setCurveCount(curveCount + 1)
  };
  const updateSelects = (i: number, prop: any, changeDate: boolean) => {
    const arr = selects;
    const obj = selects[i];
    if (changeDate) {
      obj.date = prop.toISOString().split("T")[0];
    } else {
      obj.name = prop;
    }
    setSelects(arr);
    setCount(count + 1);
    setCurveCount(curveCount + 1)

  };


  return (
    <div style={styles.wrapper}>
      <div style={styles.selectsArea}>
        {selects.map((item, i) => (
            // @ts-ignore
          <div key={i} style={styles.selectContainer}>

            <div style={{verticalAlign: 'middle', padding: 10, borderBottom: '2px solid' + colors[i]}}>
              <div style={{display: 'flex'}}>

              <DatePicker

                  selected={new Date(item.date)}
                  onChange={(date) => updateSelects(i, date, true)}
                  customInput={<CustomInput />}
              />

              <select
                value={item.name}
                onChange={(e) => updateSelects(i, e.target.value, false)}
              >
                <option value="mill_1">Mill_1</option>
                <option value="mill_2">Mill_2</option>
                <option value="mill_3">Mill_3</option>
              </select>


              </div>
            <div style={{display: 'flex', margin: 10}}>
              <span style={{marginRight: 10, fontSize: 20}}>Hours: </span>
              <select
                  value={selects[i].startHour}
                  onChange={(e) => handleStartInput( parseInt(e.target.value), i)}
              >
                {_.times(24, (i) => (
                    <option value={i}>{i}</option>
                ))}
              </select>
              <span> - </span>
              <select
                  value={selects[i].endHour}
                  onChange={(e) => handleEndInput(parseInt(e.target.value),i)}
              >
                {_.times(24, (i) => (
                    <option value={i}>{i}</option>
                ))}
              </select>

            </div>
            </div>
            <button style={styles.xBtn} onClick={() => deleteSelects(i)}>
              x
            </button>

          </div>
        ))}
        <button
          onClick={() =>
            addSelects({
              name: "mill_1",
              date: date.toISOString().split("T")[0],
              startHour: 8,
              endHour: 10
            })
          }
        >
          +
        </button>
      </div>
      <div>
      <StackedGraph key={count} parameters={selects} />
      </div>
      <div>
       <Curve
           key={curveCount}
           parameters={selects}
       />
      </div>
    </div>
  );
}
