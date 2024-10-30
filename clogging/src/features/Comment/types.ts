export interface Comment {
  id: string;
  postId: string;
  nickname: string;
  content: string;
  password: string;
  isPrivate: boolean;
  isAuthor: boolean;
  createdAt: string;
  parentCommentId?: string;
  replies?: Comment[];
}

export interface CommentWithReplies extends Omit<Comment, 'replies'> {
  replies?: CommentWithReplies[];
}

export interface commentItemProps {
  comment: CommentWithReplies;
  level?: number;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => Promise<void>;
  onReply: (commentId: string) => void;
  editingCommentId: string | null;
  editingContent: string;
  editingIsPrivate: boolean;
  onEditContentChange: (content: string) => void;
  onEditPrivateChange: (isPrivate: boolean) => void;
  onEditSubmit: (commentId: string) => Promise<void>;
  onEditCancel: () => void;
  replyingToId: string | null;
  onReplySuccess: () => void;
  onReplyCancel: () => void;
  postId: string;
}

export interface commentFormProps {
  postId: string;
  onSuccess: () => void;
  commentId?: string;
  initialData?: {
    nickname: string;
    content: string;
    isPrivate: boolean;
  };
  mode?: 'create' | 'edit';
  parentCommentId?: string;
  defaultNickname?: string;
  hideFields?: boolean;
  defaultIsPrivate?: boolean;
}

export interface InputCommentProps {
  value: string;
  onChange: (value: string) => void;
  initialData?: Comment;
  defaultNickname?: string;
  postId: string;
  commentId: string;
  onSuccess?: () => void;
  mode: 'create' | 'edit';
}

export interface PrivateCommentProps {
  isPrivate: boolean;
  onChange: (value: boolean) => void;
}
