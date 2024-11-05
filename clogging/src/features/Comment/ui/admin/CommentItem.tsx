import React, { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/shared/providers/theme';
import { adminDeleteComment } from '../../utils/adminDeleteComment';
import ReplyList from './ReplyList';
import { AdminComment } from '@/app/(auth)/admin/comment/page';
import { adminDeleteReply } from '../../utils/adminDeleteReply'; // adminDeleteReply 가져오기
import { useRouter } from 'next/navigation';
import { useFetchSettings } from '@/features/Admin/Blog-settings/hooks/useFetchSettings';

export interface Reply {
  id: string; // 답글 ID
  postId: string; // 원래 댓글의 포스트 ID
  content: string; // 답글 내용
  createdAt: string; // 답글 생성 날짜 (문자열 형식)
  author: string; // 답글 작성자
}

export interface Comment {
  id: string; // 댓글 ID
  postId: string; // 댓글이 속한 포스트의 ID
  content: string; // 댓글 내용
  createdAt: string; // 댓글 생성 날짜 (문자열 형식)
  author: string; // 댓글 작성자
  replies: Reply[]; // 댓글에 대한 답글 배열
  repliesCount: number; // 답글 수
}

interface CommentItemProps {
  comment: AdminComment;
  onDelete: (commentId: string, postId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = React.memo(
  ({ comment, onDelete }) => {
    const { settingsData } = useFetchSettings(); // Fetch settings data
    const { isDarkMode } = useTheme();
    const router = useRouter();
    const [replies, setReplies] = useState<Reply[]>(comment.replies); // 상태로 답글 목록 관리

    const handleClick = (postId: string) => {
      router.push(`/posts/${postId}`);
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      }, 1500);
    };

    const handleDelete = async () => {
      const confirmed = confirm('댓글을 삭제하시겠습니까?');
      if (confirmed) {
        const success = await adminDeleteComment(comment.id, comment.postId);
        if (success) {
          alert('댓글이 삭제되었습니다.');
          onDelete(comment.id, comment.postId);
        } else {
          alert('댓글 삭제에 실패했습니다.');
        }
      }
    };

    const handleDeleteReply = async (replyId: string) => {
      const success = await adminDeleteReply(
        replyId,
        comment.id,
        comment.postId,
      );
      if (success) {
        alert('답글이 삭제되었습니다.');
        setReplies((prevReplies) =>
          prevReplies.filter((reply) => reply.id !== replyId),
        ); // 삭제된 답글 제외
      } else {
        alert('답글 삭제에 실패했습니다.');
      }
    };

    return (
      <li
        className={`flex flex-col gap-3 rounded-lg shadow-md p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="flex justify-between items-center">
          <div
            className="flex w-full cursor-pointer items-center"
            onClick={() => handleClick(comment.postId)}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={
                  comment.author === '관리자'
                    ? settingsData?.profileImageUrl || '/icons/user.png'
                    : '/icons/user.png'
                }
                alt={`${comment.author}`}
                width={30}
                height={30}
                className="rounded-full"
              />
            </div>
            <div className="flex-1 ml-3">
              <div className="overflow-hidden text-sm text-ellipsis mb-2">
                {comment.content}
              </div>
              <div className="flex items-center text-gray-400">
                <div className="font-bold mr-2">{comment.author}</div>
                <div>{comment.createdAt}</div>
              </div>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="group mr-2 rounded-full transition-all duration-200 ease-in-out"
          >
            <div className="w-6 h-6 p-1 transform transition-transform duration-200 ease-in-out group-hover:scale-110">
              <Image
                src={isDarkMode ? '/icons/trash_wh.png' : '/icons/trash.png'}
                alt={'삭제'}
                width={26}
                height={26}
                className="object-cover"
              />
            </div>
          </button>
        </div>

        {/* 답글 렌더링 */}
        {replies.length > 0 && (
          <ReplyList
            replies={replies}
            onDeleteReply={handleDeleteReply} // 삭제 핸들러 전달
            onClickReply={handleClick}
          />
        )}
      </li>
    );
  },
);

CommentItem.displayName = 'CommentItem';

export default CommentItem;
