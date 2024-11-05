import { db } from '@/shared/lib/firebase';
import { Timestamp, collection, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 },
      );
    }

    const postData = {
      title: body.title,
      content: body.content,
      category: body.category,
      tags: body.tags || [],
      tagIds: body.tagIds || [],
      image: body.image || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      viewCount: 0,
    };

    const postsRef = collection(db, 'posts');
    const docRef = await addDoc(postsRef, postData);

    return NextResponse.json(
      {
        post: {
          id: docRef.id,
          ...postData,
          createdAt: postData.createdAt.toDate().toISOString(),
          updatedAt: postData.updatedAt.toDate().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: '포스트 생성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
