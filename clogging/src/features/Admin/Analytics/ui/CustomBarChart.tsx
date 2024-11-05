import { ResponsiveBar } from '@nivo/bar';
import React from 'react';
import { useTheme } from '@/shared/providers/theme';

interface BarChartProps {
  data: Array<{ week: string; posts: number }>;
}

const CustomBarChart: React.FC<BarChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme();

  // 최대 포스트 수를 기반으로 y축 눈금을 설정합니다.
  const maxPosts = Math.max(...data.map((d) => d.posts));
  const tickCount = 5; // 원하는 눈금 개수

  const tickValues = Array.from(
    new Set(
      Array.from({ length: tickCount }, (_, i) =>
        Math.max(1, Math.round((maxPosts * (i + 1)) / tickCount)),
      ),
    ),
  ).sort((a, b) => a - b);

  const textColor = isDarkMode ? '#ffffff' : '#000000';

  return (
    <div style={{ height: 400, width: '100%' }}>
      <ResponsiveBar
        data={data}
        keys={['posts']}
        indexBy="week"
        margin={{ top: 30, right: 20, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={['#87CEEB']}
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
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Week',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '포스트 수',
          legendPosition: 'middle',
          legendOffset: -40,
          tickValues,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
      />
    </div>
  );
};

export default CustomBarChart;
