import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { LineChartProps } from '../../types';

const CustomLineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        width={350}
        height={200}
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="date" />
        <Tooltip />
        <CartesianGrid stroke="#e0e0e0" />
        <Line type="monotone" dataKey="uv" stroke="#6b4bcc" yAxisId={0} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
