'use client';

import { debounce } from 'lodash';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/features/Post/utils/helpers';
import { Post } from '../../types';
import { createPost, updatePost } from '../../api/postApi';

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

export const usePostEditor = (
  mode: 'create' | 'edit' = 'create',
  post?: Post,
) => {
  const router = useRouter();
  // 초기 상태 설정을 모드에 따라 다르게 처리
  const [editorState, setEditorState] = useState<BlogEditorState>(() => ({
    title: mode === 'edit' ? post?.title || '' : '',
    content: mode === 'edit' ? post?.content || '' : '',
    category: mode === 'edit' ? post?.category || post?.categoryId || '' : '',
    tags: mode === 'edit' ? post?.tags || [] : [],
    images: mode === 'edit' ? post?.image || [] : [],
    imagesToDelete: [],
    currentFile: null,
  }));

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('카테고리 Fetch 에러났어요');
        }

        const data = await response.json();
        setCategories(data.categories);

        // 편집 모드일 경우 초기 데이터 설정
        if (mode === 'edit' && post) {
          setEditorState({
            title: post.title || '',
            content: post.content || '',
            category: post.category || post.categoryId || '',
            tags: post.tags || [],
            images: post.image || [],
            imagesToDelete: [],
            currentFile: null,
          });
        }

        // setIsLoading(false);
      } catch (error) {
        setError('카테고리 불러오기 실패!');
      } finally {
        setIsLoading(false);
      }
    };

    init();
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

      // 파일명 생성
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      return fileName;
    } catch (error) {
      console.error('Image selection error:', error);
      setError('이미지 선택에 실패했습니다.');
      return null;
    }
  };

  const handleContentChange = useCallback(
    debounce((value: string) => {
      setEditorState((prev) => ({ ...prev, content: value }));
    }, 300), // 300ms 지연
    [],
  );
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

      // 유효성 검사
      if (!editorState.title.trim()) throw new Error('제목을 입력해주세요');
      if (!editorState.content.trim()) throw new Error('내용을 입력해주세요');
      if (!editorState.category) throw new Error('카테고리를 선택해주세요');

      if (mode === 'edit' && post?.id) {
        // 수정 모드
        const updateData = {
          postId: post.id,
          title: editorState.title.trim(),
          content: editorState.content.trim(),
          category: editorState.category,
          tags: editorState.tags,
          image: editorState.images,
        };

        const result = await updatePost(updateData);

        if (result.message === '포스트 수정 성공!') {
          // 태그 처리 (필요한 경우)
          try {
            await Promise.all(
              editorState.tags.map(async (tag) => {
                await fetch('/api/tags/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ tagName: tag }),
                });
              }),
            );
          } catch (tagError) {
            console.error('태그 처리 중 오류:', tagError);
            // 태그 처리 실패는 전체 실패로 처리하지 않음
          }

          router.push(`/posts/${post.id}`);
        }
      } else {
        // 생성 모드 (기존 코드 유지)
        const createData = {
          title: editorState.title.trim(),
          content: editorState.content.trim(),
          category: editorState.category,
          tags: editorState.tags,
          tagIds: [], // 서버에서 처리
          image: editorState.images,
        };

        const result = await createPost(createData);
        router.push(`/posts/${result.post.id}`);
      }
    } catch (error) {
      console.error('Post submission error:', error);
      setError(
        error instanceof Error
          ? error.message
          : `포스트 ${mode === 'edit' ? '수정' : '생성'} 중 오류가 발생했습니다`,
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return {
    editorState,
    setEditorState,
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
