'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/features/Post/utils/helpers';

interface BlogEditorState {
  title: string;
  content: string;
  category: string;
  tags: string[];
  images: string[];
  imagesToDelete: string[];
  currentFile: File | null;
}

interface Category {
  id: string;
  name: string;
}

export const usePostEditor = () => {
  const router = useRouter();
  const [editorState, setEditorState] = useState<BlogEditorState>({
    title: '',
    content: '',
    category: '',
    tags: [],
    images: [],
    imagesToDelete: [],
    currentFile: null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];

        setCategories(categoryList);
        setIsLoading(false);
      } catch (error) {
        setError('카테고리 불러오기 실패 !');
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleImageSelect = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return null;
    }

    try {
      const { downloadURL, updatedImageIds } = await uploadImage(
        // 이미지 url 수정중
        file,
        editorState.images,
        editorState.imagesToDelete,
      );

      setEditorState((prev) => ({
        ...prev,
        currentFile: file,
        images: updatedImageIds,
      }));

      return downloadURL;
    } catch (error) {
      setError('이미지 업로드에 실패했습니다.');
      return null;
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const pasteData = event.clipboardData.getData('text');
    if (
      pasteData.startsWith('http') &&
      (pasteData.endsWith('.png') ||
        pasteData.endsWith('.jpg') ||
        pasteData.endsWith('.jpeg') ||
        pasteData.endsWith('.gif'))
    ) {
      const imageMarkdown = `![image](${pasteData})\n`;
      const cursorPos = (event.target as HTMLTextAreaElement).selectionStart;

      const newContent =
        editorState.content.slice(0, cursorPos) +
        imageMarkdown +
        editorState.content.slice(cursorPos);

      handleContentChange(newContent);
      event.preventDefault();
      return;
    }

    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();

        const file = item.getAsFile();
        if (!file) continue;

        try {
          const cursorPos = (event.target as HTMLTextAreaElement)
            .selectionStart;

          const imageId = await handleImageSelect(file);
          if (imageId) {
            const imageMarkdown = `![image](/storage/posts/${imageId})\n`;
            const newContent =
              editorState.content.slice(0, cursorPos) +
              imageMarkdown +
              editorState.content.slice(cursorPos);

            handleContentChange(newContent);
          }
        } catch (error) {
          console.error('이미지 붙여넣기 실패:', error);
          setError('이미지 붙여넣기에 실패했습니다.');
        }
        break;
      }
    }
  };

  // 이미지 제거
  const handleRemoveImage = (imageId: string) => {
    setEditorState((prev) => ({
      ...prev,
      images: prev.images.filter((id) => id !== imageId),
      imagesToDelete: [...prev.imagesToDelete, imageId],
    }));
  };

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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Validation
      if (!editorState.title.trim()) {
        setError('제목을 입력해주세요');
        return;
      }
      if (!editorState.content.trim()) {
        setError('내용을 입력해주세요');
        return;
      }
      if (!editorState.category) {
        setError('카테고리를 선택해주세요');
        return;
      }

      const formData = new FormData();
      formData.append('title', editorState.title.trim());
      formData.append('content', editorState.content.trim());
      formData.append('category', editorState.category);
      formData.append('tags', JSON.stringify(editorState.tags));

      if (editorState.currentFile) {
        formData.append('image', editorState.currentFile);
      }

      editorState.images.forEach((imageId) => {
        formData.append('imageIds', imageId);
      });

      editorState.imagesToDelete.forEach((imageId) => {
        formData.append('imagesToDeleteId', imageId);
      });

      console.log('Submitting form data:', {
        title: editorState.title,
        content: editorState.content,
        category: editorState.category,
        tagsCount: editorState.tags.length,
        imagesCount: editorState.images.length,
      });

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Response status:', response.status);
        console.error('Error details:', errorData);
        throw new Error(
          `포스트 등록 실패: ${errorData.message || '알 수 없는 오류'}`,
        );
      }

      const result = await response.json();
      const postId = result.post.id;

      const tagResults = await Promise.all(
        editorState.tags.map(async (tag) => {
          try {
            const tagResponse = await fetch('/api/tags/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ tagName: tag }),
            });

            if (!tagResponse.ok) {
              const tagError = await tagResponse.json();
              console.error('태그 추가 실패:', tagError);
              return { success: false, tag, error: tagError };
            }

            const tagData = await tagResponse.json();
            return { success: true, tag, data: tagData };
          } catch (error) {
            console.error(`태그 '${tag}' 처리 중 오류:`, error);
            return { success: false, tag, error };
          }
        }),
      );

      const failedTags = tagResults.filter((result) => !result.success);
      if (failedTags.length > 0) {
        console.warn('일부 태그 처리 실패:', failedTags);
      }

      console.log('포스트 등록 성공:', postId);
      router.push(`/posts/${postId}`);
    } catch (error) {
      console.error('포스트 등록 처리 중 오류:', error);
      setError(error instanceof Error ? error.message : '포스트 등록 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return {
    editorState,
    categories,
    isLoading,
    error,
    handleTitleChange,
    handleContentChange,
    handleCategoryChange,
    handleAddTag,
    handleRemoveTag,
    handleImageSelect,
    handleRemoveImage,
    handlePaste,
    handleSubmit,
    handleGoBack,
  };
};
