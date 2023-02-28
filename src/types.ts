export type ApexXAxisType = "datetime" | "numeric" | "category" | undefined;
export type ApexChartType =
  | "line"
  | "area"
  | "bar"
  | "histogram"
  | "pie"
  | "donut"
  | "radialBar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "treemap"
  | "boxPlot"
  | "candlestick"
  | "radar"
  | "polarArea"
  | "rangeBar";
export type ApexCurveType =
  | "smooth"
  | "straight"
  | "stepline"
  | ("smooth" | "straight" | "stepline")[];
export type ApexLegend = {
  show?: boolean;
  showForSingleSeries?: boolean;
  showForNullSeries?: boolean;
  showForZeroSeries?: boolean;
  floating?: boolean;
  inverseOrder?: boolean;
  position?: "top" | "right" | "bottom" | "left";
  horizontalAlign?: "left" | "center" | "right";
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
  formatter?(legendName: string, opts?: any): string;
  tooltipHoverFormatter?(legendName: string, opts?: any): string;
  textAnchor?: string;
  customLegendItems?: string[];
  labels?: {
    colors?: string | string[];
    useSeriesColors?: boolean;
  };
  markers?: {
    width?: number;
    height?: number;
    strokeColor?: string;
    strokeWidth?: number;
    fillColors?: string[];
    offsetX?: number;
    offsetY?: number;
    radius?: number;
    customHTML?(): any;
    onClick?(): void;
  };
  itemMargin?: {
    horizontal?: number;
    vertical?: number;
  };
  containerMargin?: {
    left?: number;
    top?: number;
  };
  onItemClick?: {
    toggleDataSeries?: boolean;
  };
  onItemHover?: {
    highlightDataSeries?: boolean;
  };
};

export type dateObj = { name: string; date: string };
export type dateArr = { name: string; date: string }[];
export type curveArr = { name: string; date: string, startHour: number, endHour: number, color: string }[];
export type curveObj = { name: string; date: string, startHour: number, endHour: number, color: string  }
export type dataObj = { name: string; data: number[] };
export type dataNumArr = { name: string; data: number[] }[];
export type dataPointArr = { name: string; data: { x: number; y: number }[] }[];

export type ECO2Arr = { ECO2: number; DeviceName: string; StampDate: string }[];
export type deviceObj = {
  deviceName: string;
  onlineStatus: number;
  batteryPer: number;
  eco2: number;
  ambientTemp: number;
  humidity: number;
  tvoc: number;
};
export type curveYObj = { StampDate: string; ECO2: number };
export type ApexDatetime = "datetime" | "numeric" | "category" | undefined

