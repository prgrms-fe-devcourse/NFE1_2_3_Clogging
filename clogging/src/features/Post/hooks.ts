'use client';

import { create } from 'zustand';
import { Post } from '@/features/Post/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  onSnapshot,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

interface PostFilter {
  sortType: 'latest' | 'trending';
  lastDoc: any | null;
  setSortType: (type: 'latest' | 'trending') => void;
  setLastDoc: (doc: any | null) => void;
}

export const useRealtimeViewCount = (postId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!postId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'posts', postId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          queryClient.setQueryData(
            ['postViewCount', postId],
            data.viewCount ?? 0,
          );
        }
      },
      (error) => {
        console.error('View count subscription error:', error);
      },
    );

    return () => unsubscribe();
  }, [postId, queryClient]);

  return useQuery({
    queryKey: ['postViewCount', postId],
    queryFn: async () => {
      const docRef = await getDoc(doc(db, 'posts', postId));
      return docRef.exists() ? (docRef.data().viewCount ?? 0) : 0;
    },
    refetchOnWindowFocus: false,
  });
};

// Firebase에서 단일 게시물 조회
export const usePost = (postId: string) => {
  const queryClient = useQueryClient();

  // 실시간 조회수 업데이트 구독
  useEffect(() => {
    if (!postId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'posts', postId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const post = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toMillis(),
            updatedAt: data.updatedAt.toMillis(),
          } as Post;
          queryClient.setQueryData(['post', postId], post);
          // 조회수도 업데이트
          queryClient.setQueryData(
            ['postViewCount', postId],
            data.viewCount ?? 0,
          );
        }
      },
      (error) => {
        console.error('Post subscription error:', error);
      },
    );

    return () => unsubscribe();
  }, [postId, queryClient]);

  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      try {
        // 1. 게시글 조회
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (!postDoc.exists()) {
          throw new Error('게시글을 찾을 수 없습니다.');
        }

        // 2. 조회수 증가
        await updateDoc(doc(db, 'posts', postId), {
          viewCount: increment(1),
        });

        // 3. 업데이트된 데이터 반환
        const data = postDoc.data();
        return {
          id: postDoc.id,
          ...data,
          createdAt: data.createdAt.toMillis(),
          updatedAt: data.updatedAt.toMillis(),
          viewCount: (data.viewCount ?? 0) + 1, // 로컬에서 먼저 증가된 값 반영
        } as Post;
      } catch (error) {
        console.error('Error fetching post:', error);
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }
    },
    staleTime: 0, // 항상 최신 데이터 fetch
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
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
  const queryClient = useQueryClient();

  // 트렌딩 정렬일 때 실시간 조회수 업데이트
  useEffect(() => {
    if (sortType === 'trending' && allPosts.length > 0) {
      const unsubscribes = allPosts.map((post) =>
        onSnapshot(
          doc(db, 'posts', post.id),
          (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              // 조회수 업데이트
              queryClient.setQueryData(
                ['postViewCount', post.id],
                data.viewCount ?? 0,
              );

              // 포스트 목록 업데이트 및 재정렬
              setAllPosts((prev) => {
                const updated = prev.map((p) =>
                  p.id === post.id
                    ? { ...p, viewCount: data.viewCount ?? 0 }
                    : p,
                );
                return sortType === 'trending'
                  ? updated.sort(
                      (a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0),
                    )
                  : updated;
              });
            }
          },
          (error) => {
            console.error('Post view count subscription error:', error);
          },
        ),
      );

      return () => {
        unsubscribes.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [sortType, allPosts, queryClient]);

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

        if (!lastDoc) {
          setAllPosts(newPosts);
        } else {
          setAllPosts((prev) => {
            const uniquePosts = [...prev];
            newPosts.forEach((newPost) => {
              if (
                !uniquePosts.some(
                  (existingPost) => existingPost.id === newPost.id,
                )
              ) {
                uniquePosts.push(newPost);
              }
            });
            return uniquePosts;
          });
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

  useEffect(() => {
    setAllPosts([]);
    setLastDoc(null);
  }, [sortType, setLastDoc]);

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
