import { db } from '@/shared/lib/firebase';
import {
  collection,
  query,
  getDocs,
  collectionGroup,
  DocumentData,
} from 'firebase/firestore';
import { formatWeekDisplay } from '../utils/statisticsHelpers';

interface WeeklyData {
  week: string;
  posts: number;
  views: number;
  comments: number;
  startDate: Date;
}

interface CalendarDay {
  date: string;
  count: number;
  level: number;
}

interface BlogData {
  adminData: { label: string; value: string }[];
  postingData: { week: string; posts: number }[];
  lineData: { id: string; data: { x: string; y: number }[] }[];
  calendarData: CalendarDay[];
}
export async function getBlogData(): Promise<BlogData> {
  const postsRef = collection(db, 'posts');

  // 전체 데이터 쿼리
  const allPostsSnapshot = await getDocs(postsRef);

  // 전체 댓글 수 계산
  const commentsSnapshot = await getDocs(collectionGroup(db, 'comments'));
  const totalComments = commentsSnapshot.size;

  // 전체 통계 계산
  const totalPosts = allPostsSnapshot.size;
  const totalViews = allPostsSnapshot.docs.reduce(
    (sum, doc) => sum + ((doc.data() as DocumentData).viewCount || 0),
    0,
  );

  // 현재 날짜와 올해의 첫날 계산
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );

  // 최근 한 달 데이터 쿼리
  const monthPostsSnapshot = await getDocs(query(postsRef));
  const monthPosts = monthPostsSnapshot.docs;

  // 주별 데이터 초기화
  const weeklyData: WeeklyData[] = Array(4)
    .fill(null)
    .map((_, index) => {
      const weekStartDate = new Date(
        oneMonthAgo.getTime() + index * 7 * 24 * 60 * 60 * 1000,
      );
      return {
        week: formatWeekDisplay(weekStartDate),
        posts: 0,
        views: 0,
        comments: 0,
        startDate: weekStartDate,
      };
    });

  // 주별 포스팅 수, 조회수, 댓글 수 계산 (최근 한 달)
  monthPosts.forEach((doc) => {
    const postDate = (doc.data() as DocumentData).createdAt.toDate();
    if (postDate >= oneMonthAgo && postDate <= now) {
      const weekIndex = Math.floor(
        (postDate.getTime() - oneMonthAgo.getTime()) /
          (7 * 24 * 60 * 60 * 1000),
      );
      if (weekIndex >= 0 && weekIndex < 4) {
        weeklyData[weekIndex].posts++;
        weeklyData[weekIndex].views +=
          (doc.data() as DocumentData).viewCount || 0;
        weeklyData[weekIndex].comments +=
          (doc.data() as DocumentData).comments?.length || 0;
      }
    }
  });

  // 올해의 모든 날짜에 대한 초기 데이터 생성
  const calendarData: { [key: string]: CalendarDay } = {};
  for (let d = new Date(startOfYear); d <= now; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().split('T')[0];
    calendarData[dateString] = { date: dateString, count: 0, level: 0 };
  }

  // 실제 포스트 데이터로 calendarData 업데이트
  allPostsSnapshot.docs.forEach((doc) => {
    const postDate = (doc.data() as DocumentData).createdAt.toDate();
    if (postDate >= startOfYear && postDate <= now) {
      const dateString = postDate.toISOString().split('T')[0];
      if (calendarData[dateString]) {
        calendarData[dateString].count += 1;
      }
    }
  });

  // 최대 포스트 수 찾기
  const maxPosts = Math.max(
    ...Object.values(calendarData).map((day) => day.count),
  );

  // level 업데이트 함수
  const updateLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= maxPosts / 4) return 1;
    if (count <= maxPosts / 2) return 2;
    if (count <= (3 * maxPosts) / 4) return 3;
    return 4;
  };

  // 각 날짜의 level 업데이트
  Object.values(calendarData).forEach((day) => {
    day.level = updateLevel(day.count);
  });

  // calendarData를 배열로 변환
  const calendarDataArray = Object.values(calendarData);

  // adminData 형식으로 변환
  const adminData = [
    { label: '포스트 수', value: `${totalPosts} 개` },
    { label: '댓글 수', value: `${totalComments} 개` },
    { label: '총 조회 수', value: `${totalViews} 회` },
  ];

  // lineData 형식으로 변환
  const lineData = [
    {
      id: '조회수',
      data: weeklyData.map((week) => ({ x: week.week, y: week.views })),
    },
    {
      id: '댓글 수',
      data: weeklyData.map((week) => ({ x: week.week, y: week.comments })),
    },
  ];

  // postingData 형식으로 변환 (주간 포스팅 수)
  const postingData = weeklyData.map((week) => ({
    week: week.week,
    posts: week.posts,
  }));

  return {
    adminData,
    postingData,
    lineData,
    calendarData: calendarDataArray,
  };
}
