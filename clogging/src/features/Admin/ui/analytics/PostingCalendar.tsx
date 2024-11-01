import { useTheme } from '@/shared/providers/theme';
import React from 'react';
import ActivityCalendar from 'react-activity-calendar';

const PostingCalendar = () => {
  const { isDarkMode } = useTheme();
  const data = [
    { date: '2024-01-15', count: 1, level: 1 },
    { date: '2024-01-20', count: 1, level: 1 },
    { date: '2024-02-05', count: 2, level: 2 },
    { date: '2024-03-10', count: 1, level: 1 },
    { date: '2024-03-15', count: 2, level: 2 },
    { date: '2024-04-01', count: 3, level: 4 },
    { date: '2024-05-05', count: 1, level: 1 },
    { date: '2024-06-15', count: 1, level: 1 },
    { date: '2024-07-20', count: 1, level: 1 },
    { date: '2024-08-15', count: 1, level: 1 },
    { date: '2024-09-22', count: 1, level: 1 },
    { date: '2024-10-31', count: 1, level: 1 },
    { date: '2024-11-11', count: 1, level: 1 },
    { date: '2024-12-25', count: 1, level: 1 },
    { date: '2024-12-31', count: 1, level: 1 },
  ];
  const theme = {
    light: ['#E6EDF9', '#C5D7F5', '#9DBEF0', '#6FA1EB', '#4285F4'],
    dark: ['#1A365D', '#2A4A7F', '#3B5FA1', '#4C74C3', '#5E8AE5'],
  };
  return (
    <div>
      <ActivityCalendar
        data={data}
        theme={theme}
        colorScheme={isDarkMode ? 'dark' : 'light'}
        showWeekdayLabels={true}
        renderTooltip={({ date, count, level }) => (
          <div>
            날짜: {date}, 포스팅 수: {count}, 레벨: {level}
          </div>
        )}
        labels={{
          months: [
            '1월',
            '2월',
            '3월',
            '4월',
            '5월',
            '6월',
            '7월',
            '8월',
            '9월',
            '10월',
            '11월',
            '12월',
          ],
          weekdays: ['일', '월', '화', '수', '목', '금', '토'],
          totalCount: '{{count}} posting in 2024',
          legend: {
            less: '적음',
            more: '많음',
          },
        }}
      />
    </div>
  );
};

export default PostingCalendar;
