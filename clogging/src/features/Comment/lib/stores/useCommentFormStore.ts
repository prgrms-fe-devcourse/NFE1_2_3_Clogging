import { create } from 'zustand';

interface CommentFormState {
  form: {
    author: string;
    password: string; //숫자 4자리 고정
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
    author: '',
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
        author: isAdmin ? '작성자' : '',
        password: isAdmin ? '1234' : '',
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
        author: isAdmin
          ? '작성자'
          : initialData?.author || defaultNickname || '',
        password: isAdmin ? '1234' : '',
        content: initialData?.content || '',
        isPrivate: initialData?.isPrivate ?? defaultIsPrivate,
      },
    }),
}));
