// components/NivoLineChart.tsx
'use client';

import { useTheme } from '@/shared/providers/theme';
import { Card, CardHeader } from '@/shared/ui/common/Card';
import { ResponsiveLine } from '@nivo/line';
import { FC } from 'react';

interface DataPoint {
  x: string | number;
  y: number;
}

interface LineChartData {
  id: string;
  color: string;
  data: DataPoint[];
}

interface NivoLineChartProps {
  data: LineChartData[];
}

const NivoLineChart: FC<NivoLineChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  return (
    <div style={{ height: 400, width: '100%' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Week',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Value',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        colors={['#1E90FF', '#54b692']} // 파란색 계열로 설정
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: textColor,
              },
            },
            legend: {
              text: {
                fill: textColor,
              },
            },
          },
          legends: {
            text: {
              fill: textColor,
            },
          },
        }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default NivoLineChart;
