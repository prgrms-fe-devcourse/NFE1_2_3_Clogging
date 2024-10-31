export async function fetchBlogData() {
  const adminData = [
    { label: '포스트 수', value: '100 개' },
    { label: '댓글 수', value: '121 개' },
    { label: '총 조회 수', value: '121 회' },
    { label: '인기포스트 조회수', value: '121 회' },
    { label: '포스팅 수', value: '12 회' },
  ];
  const viewsData = [
    { date: '2024-01', views: 200 },
    { date: '2024-02', views: 300 },
    { date: '2024-03', views: 400 },
    { date: '2024-04', views: 350 },
  ];
  const lineData = [
    {
      id: '조회수',
      color: 'hsl(213, 70%, 50%)',
      data: [
        { x: '2024-01', y: 200 },
        { x: '2024-02', y: 300 },
        { x: '2024-03', y: 400 },
        { x: '2024-04', y: 350 },
      ],
    },
    {
      id: '댓글 수',
      color: 'hsl(120, 70%, 50%)',
      data: [
        { x: '2024-01', y: 100 },
        { x: '2024-02', y: 150 },
        { x: '2024-03', y: 200 },
        { x: '2024-04', y: 180 },
      ],
    },
  ];

  return { adminData, viewsData, lineData };
}
