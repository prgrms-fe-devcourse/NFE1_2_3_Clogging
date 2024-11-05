import { NextResponse } from 'next/server';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { createPostData } from '@/features/Post/utils/helpers';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title')?.toString();
    const content = formData.get('content')?.toString();
    const category = formData.get('category')?.toString();
    const tags = JSON.parse(formData.get('tags')?.toString() || '[]'); // 추가된 부분
    const tagIds = JSON.parse(formData.get('tagIds')?.toString() || '[]');
    const image = formData.get('image') as File | null;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: '제목과 내용과 카테고리 선택은 필수입니다!' },
        { status: 400 },
      );
    }

    const postData = await createPostData(
      title,
      content,
      image,
      null,
      category,
      tags,
      tagIds,
    );

    const postRef = await addDoc(collection(db, 'posts'), postData);

    await Promise.all(
      tagIds.map(async (tagId: string) => {
        const tagRef = doc(db, 'tags', tagId);
        await updateDoc(tagRef, {
          posts: arrayUnion(postRef.id),
        });
      }),
    );

    return NextResponse.json(
      {
        message: '포스트 생성 성공!',
        post: {
          id: postRef.id,
          ...postData,
          tags,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: '포스트 생성 실패!' }, { status: 500 });
  }
}
