import { NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { createPostData } from '@/features/Post/utils/helpers';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title')?.toString();
    const content = formData.get('content')?.toString();
    const image = formData.get('image') as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용은 필수입니다!' },
        { status: 400 },
      );
    }

    const imagesToDeleteId = formData.getAll('imagesToDeleteId') as string[];

    const postData = await createPostData(
      title,
      content,
      image,
      imagesToDeleteId,
    );

    const postRef = await addDoc(collection(db, 'posts'), postData);

    return NextResponse.json(
      {
        message: '포스트 생성 성공!',
        post: {
          id: postRef.id,
          ...postData,
          createdAt: postData.createdAt.toMillis(),
          updatedAt: postData.updatedAt.toMillis(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: '포스트 생성 실패!' }, { status: 500 });
  }
}
