import { db } from '@/shared/lib/firebase';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { postId, title, content, image, category, tags } = body; // category와 tags 추가

    if (!postId || !title || !content) {
      return NextResponse.json(
        { message: '포스트 수정 실패!' },
        { status: 400 },
      );
    }

    console.log('Updating post with data:', {
      postId,
      title,
      content,
      image,
      category,
      tags,
    });

    const postRef = doc(db, 'posts', postId);
    const updateData = {
      title,
      content,
      image,
      categoryId: category, // categoryId로 저장
      tags: tags || [], // 빈 배열 기본값 설정
      updatedAt: Timestamp.now(),
    };

    await updateDoc(postRef, updateData);

    return NextResponse.json({
      message: '포스트 수정 성공!',
      post: {
        id: postId,
        ...updateData,
        createdAt: Timestamp.now().toDate().toISOString(), // 생성 시간 추가
        updatedAt: updateData.updatedAt.toDate().toISOString(),
      },
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      {
        message: '포스트 수정 실패!',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 },
    );
  }
}
