import { db } from '@/shared/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Post } from '../types';

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

export const updatePost = async (formData: FormData) => {
  console.log('formData 이미지 수정 요청: ', formData);

  try {
    const response = await fetch('/api/posts/update', {
      method: 'PUT',
      body: formData,
    });

    console.log('formData 이미지 응답 결과: ', formData);

    if (!response.ok) {
      throw new Error('포스트 수정에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('포스트 수정 중 에러:', error);
    throw error;
  }
};
