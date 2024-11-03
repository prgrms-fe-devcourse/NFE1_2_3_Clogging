import { useTheme } from '@/shared/providers/theme';
import { Card, CardHeader } from '@/shared/ui/common/Card';
import { ResponsiveBar } from '@nivo/bar';
import React from 'react';

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

  return (
    <Card className="">
      <CardHeader>주간 포스팅 수</CardHeader>
      <div style={{ height: 400, width: '100%' }}>
        <ResponsiveBar
          data={data}
          keys={['posts']}
          indexBy="week"
          margin={{ top: 30, right: 20, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
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
        />
      </div>
    </Card>
  );
};

export default CustomBarChart;
