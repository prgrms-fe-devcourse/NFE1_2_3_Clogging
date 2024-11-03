export async function fetchBlogData() {
  const adminData = [
    { label: '포스트 수', value: '100 개' },
    { label: '댓글 수', value: '121 개' },
    { label: '총 조회 수', value: '121 회' },
  ];
  const lineData = [
    {
      id: '주간 조회 수',
      color: 'hsl(120, 70%, 50%)',
      data: [
        { x: '10월 1째주', y: 100 },
        { x: '10월 2째주', y: 150 },
        { x: '10월 3째주', y: 200 },
        { x: '10월 4째주', y: 180 },
      ],
    },
  ];
  const postingData = [
    { date: '10월 1째주', posts: 200 },
    { date: '10월 2째주', posts: 300 },
    { date: '10월 3째주', posts: 400 },
    { date: '10월 4째주', posts: 350 },
  ];

  return { adminData, postingData, lineData };
}
