const xAxis = () => {
    const arr = [];
    for (let i = 9; i < 18; i++) {
      for (let j = 0; j < 12; j++) {
         const k = j*5
        if (i < 10 &&  k < 10) {
          arr.push("2018-09-19T0" + i + ":" + "0" + k + ":00.000Z");
        } else if (i > 9 && k < 10) {
          arr.push("2018-09-19T" + i + ":" + "0" + k + ":00.000Z");
        } else if (i < 10 && k > 9) {
          arr.push("2018-09-19T0" + i + ":" + k + ":00.000Z");
        } else {
          arr.push(`2018-09-19T${i}:${k}:00.000Z`);
        }
      }
    }
    return arr;
  };

  export default xAxis