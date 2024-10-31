export interface DataPoint {
  date: string; // 날짜 형식
  uv: number; // 값
  pv: number; // 값
}

export interface LineChartProps {
  data: DataPoint[];
}
