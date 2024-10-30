import { create } from 'zustand';
import { CommentWithReplies } from '../../types';

interface CommentListState {
  editingCommentId: string | null;
  editingContent: string;
  editingIsPrivate: boolean;
  replyingToId: string | null;
  isAdmin: boolean;

  // Actions
  setEditingComment: (
    commentId: string | null,
    content?: string,
    isPrivate?: boolean,
  ) => void;
  setReplyingTo: (commentId: string | null) => void;
  setIsAdmin: (status: boolean) => void;
  resetEditingState: () => void;

  // Comment finding utility
  findComment: (
    comments: CommentWithReplies[],
    commentId: string,
  ) => CommentWithReplies | undefined;
}

export const useCommentListStore = create<CommentListState>((set, get) => ({
  editingCommentId: null,
  editingContent: '',
  editingIsPrivate: false,
  replyingToId: null,
  isAdmin: false,

  setEditingComment: (commentId, content = '', isPrivate = false) =>
    set({
      editingCommentId: commentId,
      editingContent: content,
      editingIsPrivate: isPrivate,
    }),

  setReplyingTo: (commentId) =>
    set({
      replyingToId: commentId,
    }),

  setIsAdmin: (status) =>
    set({
      isAdmin: status,
    }),

  resetEditingState: () =>
    set({
      editingCommentId: null,
      editingContent: '',
      editingIsPrivate: false,
    }),

  findComment: (comments, commentId) => {
    for (const comment of comments) {
      if (comment.id === commentId) return comment;
      if (comment.replies) {
        const found = get().findComment(comment.replies, commentId);
        if (found) return found;
      }
    }
    return undefined;
  },
}));
