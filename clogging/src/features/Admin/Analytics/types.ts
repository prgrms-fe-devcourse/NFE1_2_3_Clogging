export interface DataPoint {
  date: string; // 날짜 형식
  uv: number; // 값
  pv: number; // 값
}

export interface LineChartProps {
  data: DataPoint[];
}
export interface BlogAnalyticsProps {
  data: {
    adminData: Array<{ label: string; value: string }>;
    postingData: Array<{ date: string; views: number }>;
    lineData: Array<{
      id: string;
      color: string;
      data: Array<{ x: string; y: number }>;
    }>;
  };
}

export interface BlogDataCardProps {
  label: string;
  value: string;
}
