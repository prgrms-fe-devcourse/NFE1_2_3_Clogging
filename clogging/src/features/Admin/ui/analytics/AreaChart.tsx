import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const CustomAreaChart = () => {
  const data = [
    { date: '10월 25일', views: 350 },
    { date: '10월 26일', views: 420 },
    { date: '10월 27일', views: 150 },
    { date: '10월 28일', views: 280 },
    { date: '10월 29일', views: 500 },
    { date: '10월 30일', views: 390 },
    { date: '10월 31일', views: 460 },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        width={350}
        height={200}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default CustomAreaChart;
