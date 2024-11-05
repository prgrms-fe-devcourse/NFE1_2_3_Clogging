import { db } from '@/shared/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Post } from '../types';

interface CreatePostData {
  title: string;
  content: string;
  image: string[];
  category: string;
  tags: string[];
  tagIds: string[];
}

interface UpdatePostData {
  postId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  image: string[];
}

export const getPost = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      throw new Error('Post not found');
    }

    // Firestore 문서 데이터를 Post 타입으로 변환
    const postData = {
      id: postSnap.id,
      ...postSnap.data(),
      createdAt: postSnap.data().createdAt.toDate().toISOString(),
      updatedAt: postSnap.data().updatedAt?.toDate().toISOString(),
    } as Post;

    return postData;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

export const createPost = async (data: CreatePostData) => {
  try {
    const response = await fetch('/api/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('포스트 생성에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('포스트 생성 중 에러:', error);
    throw error;
  }
};

export const updatePost = async (data: UpdatePostData) => {
  try {
    const response = await fetch('/api/posts/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('포스트 수정에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('포스트 수정 중 에러:', error);
    throw error;
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await fetch('/api/posts/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error('포스트 삭제에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('포스트 삭제 중 에러:', error);
    throw error;
  }
};
