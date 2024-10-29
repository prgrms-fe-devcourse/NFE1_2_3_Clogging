import React from 'react';

const CommentList: React.FC<CommentListProps> = ({}) => {
  return (
    <div>
      <h2>댓글 목록</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.nickname}</strong>: {comment.content}
            {comment.isAuthor && <span> (작성자)</span>}
            <button onClick={() => onDeleteComment(comment.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
