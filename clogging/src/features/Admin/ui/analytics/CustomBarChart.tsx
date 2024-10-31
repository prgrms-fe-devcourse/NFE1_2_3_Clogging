import { ResponsiveBar } from '@nivo/bar';
import React from 'react';

interface BarChartProps {
  data: Array<{ date: string; views: number }>;
}

const CustomBarChart: React.FC<BarChartProps> = ({ data }) => (
  <div style={{ height: 400, width: '100%' }}>
    <ResponsiveBar
      data={data}
      keys={['views']}
      indexBy="date"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Date',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Views',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
    />
  </div>
);
export default CustomBarChart;
