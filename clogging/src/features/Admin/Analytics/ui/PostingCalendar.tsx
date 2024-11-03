import React from 'react';
import ActivityCalendar, { Activity } from 'react-activity-calendar';
import { useTheme } from '@/shared/providers/theme';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface CalendarData extends Activity {
  date: string;
  count: number;
  level: number;
}

interface PostingCalendarProps {
  calendarData: CalendarData[];
}

const PostingCalendar: React.FC<PostingCalendarProps> = ({ calendarData }) => {
  const { isDarkMode } = useTheme();
  const theme = {
    light: ['#E6EDF9', '#C5D7F5', '#9DBEF0', '#6FA1EB', '#4285F4'],
    dark: ['#1A365D', '#2A4A7F', '#3B5FA1', '#4C74C3', '#5E8AE5'],
  };

  return (
    <div>
      <ActivityCalendar
        data={calendarData}
        theme={theme}
        colorScheme={isDarkMode ? 'dark' : 'light'}
        showWeekdayLabels={true}
        fontSize={14}
        style={{
          width: '100%',
          height: '100%',
        }}
        renderBlock={(block, activity) =>
          React.cloneElement(block, {
            'data-tooltip-id': 'react-tooltip',
            'data-tooltip-html': `${activity.count} activities on ${activity.date}`,
          })
        }
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
      <ReactTooltip id="react-tooltip" />
    </div>
  );
};

export default PostingCalendar;
