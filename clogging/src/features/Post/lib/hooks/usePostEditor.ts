'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useRouter } from 'next/navigation';

interface BlogEditorState {
  title: string;
  content: string;
  category: string;
  tags: string[];
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
      // posts 컬렉션에 저장
      const postData = {
        ...editorState,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const postDoc = await addDoc(collection(db, 'posts'), postData);

      const tagsCollection = collection(db, 'tags');
      const existingTagsSnapshot = await getDocs(tagsCollection);

      const existingTagSet = new Set(
        existingTagsSnapshot.docs.map((doc) => doc.data().name),
      );

      const newTags = editorState.tags.filter(
        (tag) => !existingTagSet.has(tag),
      );

      await Promise.all(
        newTags.map(async (tag) => {
          const tagQuery = query(tagsCollection, where('name', '==', tag));
          const tagSnapshot = await getDocs(tagQuery);

          if (tagSnapshot.empty) {
            await addDoc(tagsCollection, {
              name: tag,
              count: 1,
            });
          }
        }),
      );

      router.push(`/posts/${postDoc.id}`);

      console.log('포스트 등록 성공:', postDoc.id);
    } catch (error) {
      console.error('포스트 등록 실패:', error);
      setError('포스트 등록 실패');
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
    // handleSaveDraft,
    handleSubmit,
    handleGoBack,
  };
};
