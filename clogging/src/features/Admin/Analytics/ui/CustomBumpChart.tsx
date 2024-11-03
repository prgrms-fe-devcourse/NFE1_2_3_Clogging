'use client';

import { ResponsiveBump } from '@nivo/bump';
import { Card, CardHeader } from '@/shared/ui/common/Card';
import { FC } from 'react';

interface DataPoint {
  x: string;
  y: number;
}

interface BumpChartData {
  id: string;
  data: DataPoint[];
}

interface WeeklyViewsBumpChartProps {
  data: BumpChartData[];
}

const CustomBumpChart: FC<WeeklyViewsBumpChartProps> = ({ data }) => (
  <Card>
    <CardHeader>주간 조회수</CardHeader>
    <div style={{ height: 400, width: '100%' }}>
      <ResponsiveBump
        data={data}
        margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
        xOuterPadding={0.15}
        yOuterPadding={0.15}
        colors={{ scheme: 'spectral' }}
        lineWidth={3}
        activeLineWidth={6}
        inactiveLineWidth={3}
        inactiveOpacity={0.15}
        pointSize={10}
        activePointSize={16}
        inactivePointSize={0}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={3}
        activePointBorderWidth={3}
        pointBorderColor={{ from: 'serie.color' }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '조회수',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        startLabel={(d) => `${d.id}: ${d.data[0].y}`}
        endLabel={(d) => `${d.id}: ${d.data[d.data.length - 1].y}`}
        yScale={{ type: 'linear', reverse: false }}
        tooltip={({ serie, point }) => (
          <div
            style={{
              background: 'white',
              padding: '9px 12px',
              border: '1px solid #ccc',
            }}
          >
            <strong>{serie.id}</strong>
            <br />
            {point.data.x}: {point.data.y}
          </div>
        )}
      />
    </div>
  </Card>
);

export default CustomBumpChart;
