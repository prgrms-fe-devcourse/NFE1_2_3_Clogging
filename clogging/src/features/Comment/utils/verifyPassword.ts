import { CommentWithReplies } from '../types';

export const verifyPassword = async (
  comment: CommentWithReplies,
  action: '수정' | '삭제' | '수정 완료',
  isAdmin: boolean,
): Promise<boolean> => {
  if (isAdmin) {
    if (action === '삭제') {
      return window.confirm('정말로 삭제하시겠습니까?');
    }
    return true;
  }

  const password = prompt(
    `${action}${action === '수정 완료' ? '를' : '을'} 위해 비밀번호를 입력해주세요.`,
  );
  if (!password) return false;

  if (password !== comment.password) {
    alert('비밀번호가 일치하지 않습니다.');
    return false;
  }

  return true;
};
