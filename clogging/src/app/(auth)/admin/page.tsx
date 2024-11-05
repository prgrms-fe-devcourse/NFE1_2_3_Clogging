'use client';
import { useEffect, useState } from 'react';
import { getBlogData } from '@/features/Admin/Analytics/hooks/getBlogData';
import { getAllComments } from '@/features/Comment/api/getAllComments';
import { AdminComment } from './comment/page';
import BlogDataSection from '@/features/Admin/Dashboard/ui/BlogDataSection';
import CommentSection from '@/features/Admin/Dashboard/ui/CommentSection';
import LoadingError from '@/features/Admin/Dashboard/ui/LoadingError';
import PostListSection from '@/features/Admin/Dashboard/ui/PostListSection';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminData, setAdminData] = useState(null);
  const [postData, setPostData] = useState(null);

  const [commentsData, setCommentsData] = useState<{
    comments: AdminComment[];
    totalComments: number;
  } | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const data = await getBlogData();
        setAdminData(data.adminData);
        setPostData(data.recentPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchBlogData();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getAllComments();
        setCommentsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleDeleteComment = (commentId: string) => {
    if (commentsData) {
      setCommentsData((prevData) => ({
        comments: prevData.comments.filter(
          (comment) => comment.id !== commentId,
        ),
        totalComments: prevData.totalComments - 1,
      }));
    }
  };

  return (
    <div>
      <LoadingError loading={loading} error={error} />
      {!loading && !error && (
        <>
          <BlogDataSection adminData={adminData} />
          <div className="flex flex-wrap items-start justify-between w-full h-full">
            <div className="flex-grow sp-x-2 mb-4">
              <PostListSection postData={postData} />
            </div>
            <div className="flex-grow sp-x-2">
              <CommentSection
                comments={commentsData?.comments || []}
                totalComments={commentsData?.totalComments || 0}
                onDelete={handleDeleteComment}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
