export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // 시간을 24시간 형식으로 가져오되, 24:00 이후는 00:00으로 처리
  let hours = date.getHours();
  if (hours === 24) hours = 0;

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(
      /(\d+):(\d+):(\d+)/,
      (_, h, m, s) => `${hours.toString().padStart(2, '0')}:${m}:${s}`,
    );
};
