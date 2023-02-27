import ArcProgress from "react-arc-progress";
import * as React from "react";
const styles = {
  values: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
export const ValueContainer = (param: {
  title: string;
  unit: string;
  value: number;
  max: number;
}) => {
  const progress = param.value / param.max;
  return (
    <div style={styles.values}>
      <div>
        <ArcProgress
          progress={progress}
          text={`${param.value} ${param.unit}`}
          textStyle={{ size: "30px", font: "tahoma" }}
        />

        <h2>{param.title}</h2>
      </div>
    </div>
  );
};
