import React from 'react';
import Image from 'next/image';
import { adminDeleteReply } from '../../utils/adminDeleteReply';

interface Reply {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author: string;
}

interface ReplyListProps {
  replies: Reply[];
  commentId: string; // 댓글 ID
  postId: string; // 포스트 ID
}

const ReplyList: React.FC<ReplyListProps> = ({
  replies,
  commentId,
  postId,
}) => {
  const handleDeleteReply = async (replyId: string) => {
    const password = prompt('답글 삭제를 위해 비밀번호를 입력하세요.');
    if (password) {
      const confirmed = confirm('답글을 삭제하시겠습니까?');
      if (confirmed) {
        const success = await adminDeleteReply(
          commentId,
          replyId,
          postId,
          password,
        );
        if (success) {
          alert('답글이 삭제되었습니다.');
          // 여기에서 답글 목록을 새로고침하거나 상태를 업데이트하는 로직을 추가
        } else {
          alert('답글 삭제에 실패했습니다.');
        }
      }
    }
  };

  return (
    <ul className="ml-2 mt-2 space-y-2">
      {replies.map((reply) => (
        <li
          key={reply.id}
          className={`flex items-center gap-2 rounded-lg shadow-sm p-2 bg-gray-100`}
        >
          <Image
            src="/icons/user.png"
            alt={`${reply.author}`}
            width={20}
            height={20}
          />
          <div className="flex-1 ml-2">
            <div className="overflow-hidden text-ellipsis mb-1">
              {reply.content}
            </div>
            <div className="text-xs text-gray-500">
              {reply.author} - {reply.createdAt}
            </div>
          </div>
          <button
            onClick={() => handleDeleteReply(reply.id)}
            className="w-6 h-6 p-1 group rounded-full transition-all duration-200 ease-in-out"
          >
            <Image
              src="/icons/trash.png"
              alt={'삭제'}
              width={20}
              height={20}
              className="object-cover"
            />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ReplyList;
