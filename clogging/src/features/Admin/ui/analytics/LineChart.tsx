import React from 'react';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip } from 'recharts';

interface DataPoint {
  date: string; // 날짜 형식
  uv: number; // 값
  pv: number; // 값
}

interface LineChartProps {
  data: DataPoint[];
  width: number; // Accept width as a prop
}

const CustomLineChart: React.FC<LineChartProps> = ({ data, width }) => (
  <LineChart
    width={width} // Use responsive width passed as prop
    height={200}
    data={data}
    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
    <XAxis dataKey="date" />
    <Tooltip />
    <CartesianGrid stroke="#e0e0e0" />
    <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
  </LineChart>
);

export default CustomLineChart;
