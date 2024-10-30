'use client';

import { create } from 'zustand';
import { Post } from '@/features/Post/types';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react'; // useState, useEffect import 추가
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  where,
  startAfter,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

interface PostFilter {
  sortType: 'latest' | 'trending';
  lastDoc: any | null;
  setSortType: (type: 'latest' | 'trending') => void;
  setLastDoc: (doc: any | null) => void;
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
              createdAt: prevSnapshot.docs[0].data().createdAt.toMillis(),
              updatedAt: prevSnapshot.docs[0].data().updatedAt.toMillis(),
            } as Post)
          : null;
        const nextPost = nextSnapshot.docs[0]
          ? ({
              id: nextSnapshot.docs[0].id,
              ...nextSnapshot.docs[0].data(),
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
export const usePosts = (sortType: 'latest' | 'trending', lastDoc?: any) => {
  return useQuery({
    queryKey: ['posts', sortType, lastDoc],
    queryFn: async () => {
      try {
        const postsRef = collection(db, 'posts');
        let queryConstraints: QueryConstraint[] = [
          sortType === 'latest'
            ? orderBy('createdAt', 'desc')
            : orderBy('viewCount', 'desc'),
          limit(20),
        ];

        if (lastDoc) {
          queryConstraints = [...queryConstraints, startAfter(lastDoc)];
        }

        const postsQuery = query(postsRef, ...queryConstraints);
        const querySnapshot = await getDocs(postsQuery);

        const posts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toMillis() ?? Date.now(),
            updatedAt: data.updatedAt?.toMillis() ?? Date.now(),
            viewCount: data.viewCount ?? 0,
          } as Post;
        });

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        const hasMore = querySnapshot.docs.length === 20;

        return {
          posts,
          lastVisible,
          hasMore,
        };
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('게시글 목록을 불러오는데 실패했습니다.');
      }
    },
  });
};

// 정렬 상태 관리를 위한 Zustand store
export const usePostFilter = create<PostFilter>((set) => ({
  sortType: 'latest',
  lastDoc: null,
  setSortType: (type) => set({ sortType: type, lastDoc: null }),
  setLastDoc: (doc) => set({ lastDoc: doc }),
}));

// 필터링된 포스트 목록을 가져오는 훅
export const useFilteredPosts = () => {
  const { sortType, lastDoc, setLastDoc } = usePostFilter();
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', sortType, lastDoc],
    queryFn: async () => {
      try {
        const postsRef = collection(db, 'posts');
        let queryConstraints: QueryConstraint[] = [
          sortType === 'latest'
            ? orderBy('createdAt', 'desc')
            : orderBy('viewCount', 'desc'),
          limit(20),
        ];

        if (lastDoc) {
          queryConstraints = [...queryConstraints, startAfter(lastDoc)];
        }

        const postsQuery = query(postsRef, ...queryConstraints);
        const querySnapshot = await getDocs(postsQuery);

        const newPosts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toMillis() ?? Date.now(),
            updatedAt: data.updatedAt?.toMillis() ?? Date.now(),
            viewCount: data.viewCount ?? 0,
          } as Post;
        });

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        const hasMore = querySnapshot.docs.length === 20;

        // lastDoc이 null이면 새로운 정렬이므로 posts를 대체
        // 아니면 기존 posts에 새로운 posts를 추가
        if (!lastDoc) {
          setAllPosts(newPosts);
        } else {
          setAllPosts((prev) => [...prev, ...newPosts]);
        }

        return {
          posts: newPosts,
          lastVisible,
          hasMore,
        };
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('게시글 목록을 불러오는데 실패했습니다.');
      }
    },
  });

  // 정렬 타입이 변경되면 allPosts 초기화
  useEffect(() => {
    setAllPosts([]);
    setLastDoc(null);
  }, [sortType]);

  return {
    data: {
      posts: allPosts,
      lastVisible: data?.lastVisible,
      hasMore: data?.hasMore,
    },
    isLoading,
    error,
  };
};
