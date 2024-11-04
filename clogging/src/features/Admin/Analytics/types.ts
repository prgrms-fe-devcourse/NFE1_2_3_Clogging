// --------------------------------------------- 통계 interface

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
    postingData: Array<{ week: string; posts: number }>;
    lineData: Array<{
      id: string;
      color: string;
      data: Array<{ x: string; y: number }>;
    }>;
    calendarData: Array<{ date: string; count: number; level: string }>;
  };
}
export interface BlogDataCardProps {
  label: string;
  value: string;
}

export interface BlogData {
  adminData: { label: string; value: string }[];
  postingData: { week: string; posts: number }[];
  lineData: { id: string; data: { x: string; y: number }[] }[];
  calendarData: CalendarDay[];
}

export interface WeeklyData {
  week: string;
  posts: number;
  views: number;
  comments: number;
  startDate: Date;
}

export interface CalendarDay {
  date: string;
  count: number;
  level: number;
}
