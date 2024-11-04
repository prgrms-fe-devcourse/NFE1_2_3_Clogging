'use client';
import BlogDataList from '@/features/Admin/Analytics/ui/BlogDataList';
import { getBlogData } from '@/features/Admin/Analytics/hooks/getBlogData';
import CommentList from '@/features/Comment/ui/admin/CommentList';
import { AdminComment } from './comment/page';
import { useEffect, useState } from 'react';
import { getAllComments } from '@/features/Comment/api/getAllComments';

export default function AdminPage() {
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState<string | null>(null); // 오류 상태 관리
  const [adminData, setAdminData] = useState(null);

  const [commentsData, setCommentsData] = useState<{
    comments: AdminComment[]; // 댓글 데이터 배열
    totalComments: number; // 총 댓글 수
  } | null>(null); // 초기값은 null

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const data = await getBlogData();
        setAdminData(data.adminData); // adminData 상태 업데이트
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchBlogData();
  }, []);
  // getBlogData()는 비동기 함수이므로, 이 호출이 완료되기 전에 adminData를 사용하려고 하면 undefined가 될 수 있음.
  console.log(adminData);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getAllComments(); // 댓글 데이터 로드
        setCommentsData(data); // 댓글 데이터 상태 업데이트
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error'); // 오류 메시지 처리
      } finally {
        setLoading(false); // 로딩 완료 상태로 변경
      }
    };

    fetchComments(); // 댓글 데이터 가져오기 호출
  }, []);

  // 댓글 삭제 핸들러 정의
  const handleDeleteComment = (commentId: string) => {
    if (commentsData) {
      setCommentsData((prevData) => ({
        comments: prevData.comments.filter(
          (comment) => comment.id !== commentId, // 삭제할 댓글 제외
        ),
        totalComments: prevData.totalComments - 1, // 총 댓글 수 감소
      }));
    }
  };

  if (loading) {
    return <div>Loading comments...</div>; // 로딩 중 메시지 표시
  }

  if (error) {
    return <div>Error loading comments: {error}</div>; // 오류 발생 시 메시지 표시
  }

  return (
    <div className="">
      <div className="flex flex-wrap gap-4 mb-4">
        {adminData && <BlogDataList adminData={adminData} />}
        {/* adminData가 있을 때만 렌더링 */}
      </div>
      <div className="w-[49%] sm:w-full md:w-[49%]">
        <CommentList
          initialComments={commentsData?.comments || []}
          totalComments={commentsData?.totalComments || 0}
          onDelete={handleDeleteComment}
          PAGE_SIZE={3}
        />
      </div>
    </div>
  );
}
