'use client';

import { create } from 'zustand';
import { Post } from '@/features/Post/types';
import { useQuery } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

interface PostFilter {
  sortType: 'latest' | 'trending';
  setSortType: (type: 'latest' | 'trending') => void;
}

// Firebase에서 단일 게시물 조회
export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (!postDoc.exists()) {
          throw new Error('게시글을 찾을 수 없습니다.');
        }
        const data = postDoc.data();
        return {
          id: postDoc.id,
          ...data,
          createdAt: data.createdAt.toMillis(),
          updatedAt: data.updatedAt.toMillis(),
        } as Post;
      } catch (error) {
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }
    },
  });
};

// Firebase에서 이전/다음 게시물 조회
export const useAdjacentPosts = (currentPostId: string) => {
  return useQuery({
    queryKey: ['adjacentPosts', currentPostId],
    queryFn: async () => {
      try {
        const postsRef = collection(db, 'posts');
        const currentPostDoc = await getDoc(doc(db, 'posts', currentPostId));

        if (!currentPostDoc.exists()) {
          throw new Error('게시글을 찾을 수 없습니다.');
        }

        const currentCreatedAt = currentPostDoc.data().createdAt;

        // 이전 게시물 쿼리
        const prevQuery = query(
          postsRef,
          where('createdAt', '<', currentCreatedAt),
          orderBy('createdAt', 'desc'),
          limit(1),
        );

        // 다음 게시물 쿼리
        const nextQuery = query(
          postsRef,
          where('createdAt', '>', currentCreatedAt),
          orderBy('createdAt', 'asc'),
          limit(1),
        );

        const [prevSnapshot, nextSnapshot] = await Promise.all([
          getDocs(prevQuery),
          getDocs(nextQuery),
        ]);

        const prevPost = prevSnapshot.docs[0]
          ? ({
              id: prevSnapshot.docs[0].id,
              ...prevSnapshot.docs[0].data(),
              // Timestamp를 밀리초로 변환
              createdAt: prevSnapshot.docs[0].data().createdAt.toMillis(),
              updatedAt: prevSnapshot.docs[0].data().updatedAt.toMillis(),
            } as Post)
          : null;
        const nextPost = nextSnapshot.docs[0]
          ? ({
              id: nextSnapshot.docs[0].id,
              ...nextSnapshot.docs[0].data(),
              // Timestamp를 밀리초로 변환
              createdAt: nextSnapshot.docs[0].data().createdAt.toMillis(),
              updatedAt: nextSnapshot.docs[0].data().updatedAt.toMillis(),
            } as Post)
          : null;

        return { prevPost, nextPost };
      } catch (error) {
        console.error('Error fetching adjacent posts:', error);
        throw new Error('인접 게시글을 불러오는데 실패했습니다.');
      }
    },
  });
};

// 게시물 목록 조회 훅
export const usePosts = (sortType: 'latest' | 'trending') => {
  return useQuery({
    queryKey: ['posts', sortType],
    queryFn: async () => {
      try {
        const postsRef = collection(db, 'posts');
        const queryConstraints = [
          // 정렬 조건만 지정
          sortType === 'latest'
            ? orderBy('createdAt', 'desc')
            : orderBy('viewCount', 'desc'),
          limit(20), // 한 번에 가져올 게시물 수 제한
        ];

        const postsQuery = query(postsRef, ...queryConstraints);
        const querySnapshot = await getDocs(postsQuery);

        // viewCount가 없는 경우를 대비한 기본값 처리만 추가
        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Timestamp를 밀리초로 변환
            createdAt: data.createdAt.toMillis(),
            updatedAt: data.updatedAt.toMillis(),
            viewCount: data.viewCount ?? 0, // viewCount가 없으면 0으로
          } as Post;
        });
      } catch (error) {
        console.error('Error fetching posts:', error); // 에러 로깅 추가
        throw new Error('게시글 목록을 불러오는데 실패했습니다.');
      }
    },
  });
};

// 정렬 상태 관리를 위한 Zustand store
export const usePostFilter = create<PostFilter>((set) => ({
  sortType: 'latest',
  setSortType: (type) => set({ sortType: type }),
}));

// 필터링된 포스트 목록을 가져오는 훅
export const useFilteredPosts = () => {
  const { sortType } = usePostFilter();
  return usePosts(sortType);
};
