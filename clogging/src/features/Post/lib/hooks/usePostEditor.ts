// hooks/useBlogEditor.ts
import { useState } from 'react';

interface BlogEditorState {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export const usePostEditor = () => {
  const [editorState, setEditorState] = useState<BlogEditorState>({
    title: '',
    content: '',
    category: '',
    tags: [],
  });

  const handleTitleChange = (value: string) => {
    setEditorState((prev) => ({ ...prev, title: value }));
  };

  const handleContentChange = (value: string) => {
    setEditorState((prev) => ({ ...prev, content: value }));
  };

  const handleCategoryChange = (value: string) => {
    setEditorState((prev) => ({ ...prev, category: value }));
  };

  const handleAddTag = (tag: string) => {
    setEditorState((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditorState((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSaveDraft = async () => {
    // 임시저장 로직 구현
    console.log('Saving draft:', editorState);
  };

  const handleSubmit = async () => {
    // 등록 로직 구현
    console.log('Submitting:', editorState);
  };

  const handleGoBack = () => {
    // 뒤로가기 로직 구현
    console.log('Going back...');
  };

  return {
    editorState,
    handleTitleChange,
    handleContentChange,
    handleCategoryChange,
    handleAddTag,
    handleRemoveTag,
    handleSaveDraft,
    handleSubmit,
    handleGoBack,
  };
};
