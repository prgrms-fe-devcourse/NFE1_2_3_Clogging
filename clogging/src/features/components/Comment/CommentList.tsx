import { useComments } from './model/comment';

export const CommentList = ({ postId }: { postId: string }) => {
  const { data: comments, isLoading } = useComments(postId);

  if (isLoading) return <div>Loading comments...</div>;

  return (
    <div className="space-y-4">
      {comments?.map((comment) => (
        <div key={comment.id} className="p-4 border rounded">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold">{comment.nickname}</span>
              {comment.isAuthor && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded">
                  작성자
                </span>
              )}
            </div>
            <time className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </time>
          </div>
          <p>{comment.isPrivate ? '비공개 댓글입니다.' : comment.content}</p>
        </div>
      ))}
    </div>
  );
};
