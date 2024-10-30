import { create } from 'zustand';

interface CommentFormState {
  form: {
    nickname: string;
    password: string;
    content: string;
    isPrivate: boolean;
  };
  setForm: (form: Partial<CommentFormState['form']>) => void;
  resetForm: (isAdmin: boolean, defaultIsPrivate?: boolean) => void;
  initializeForm: (
    isAdmin: boolean,
    initialData?: Partial<CommentFormState['form']>,
    defaultNickname?: string,
    defaultIsPrivate?: boolean,
  ) => void;
}

export const useCommentFormStore = create<CommentFormState>((set) => ({
  form: {
    nickname: '',
    password: '',
    content: '',
    isPrivate: false,
  },
  setForm: (newForm) =>
    set((state) => ({
      form: { ...state.form, ...newForm },
    })),
  resetForm: (isAdmin, defaultIsPrivate = false) =>
    set({
      form: {
        nickname: isAdmin ? '작성자' : '',
        password: isAdmin ? 'admin' : '',
        content: '',
        isPrivate: defaultIsPrivate,
      },
    }),
  initializeForm: (
    isAdmin,
    initialData,
    defaultNickname,
    defaultIsPrivate = false,
  ) =>
    set({
      form: {
        nickname: isAdmin
          ? '작성자'
          : initialData?.nickname || defaultNickname || '',
        password: isAdmin ? 'admin' : '',
        content: initialData?.content || '',
        isPrivate: initialData?.isPrivate ?? defaultIsPrivate,
      },
    }),
}));
