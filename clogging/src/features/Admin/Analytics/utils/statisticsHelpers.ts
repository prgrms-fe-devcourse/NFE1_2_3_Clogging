export function getWeekOfMonth(date: Date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const weekNumber = Math.ceil(
    (date.getDate() + firstDayOfMonth.getDay() - 1) / 7,
  );
  return weekNumber;
}

export function formatWeekDisplay(date: Date) {
  const monthNames = [
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
  ];
  const month = monthNames[date.getMonth()];
  const weekNumber = getWeekOfMonth(date);
  return `${month} ${weekNumber}째주`;
}
