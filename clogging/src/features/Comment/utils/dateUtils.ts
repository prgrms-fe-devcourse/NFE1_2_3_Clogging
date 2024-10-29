export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric', // 연도를 숫자로 표시 (예: 2023)
    month: '2-digit', // 월을 두 자리 숫자로 표시 (예: 01, 02, ..., 12)
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24시간 형식 사용
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // 현재 시스템의 시간대 사용
  }).format(date);
};
