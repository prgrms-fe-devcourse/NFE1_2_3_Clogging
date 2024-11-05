import { uploadImage } from '@/features/Post/utils/helpers';
import { db } from '@/shared/lib/firebase';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();

    // 기본 데이터 추출
    const postId = formData.get('postId') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const categoryId = formData.get('categoryId') as string;
    const tags = JSON.parse(formData.get('tags') as string);

    // 이미지 관련 데이터 추출
    const image = formData.get('image') as File | null;
    const imageIds = JSON.parse(formData.get('imageIds') as string);
    const imagesToDeleteId = JSON.parse(
      formData.get('imagesToDeleteId') as string,
    );

    // 포스트 존재 확인
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);

    if (!postSnapshot.exists()) {
      return NextResponse.json(
        { error: '해당 포스트를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 이미지 처리
    const { updatedImageIds } = await uploadImage(
      image,
      imageIds,
      imagesToDeleteId,
    );

    // 포스트 데이터 업데이트
    const updatedData = {
      title,
      content,
      categoryId,
      tags,
      image: updatedImageIds,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(postRef, updatedData);

    return NextResponse.json(
      {
        message: '포스트 수정 성공!',
        post: {
          id: postId,
          ...updatedData,
          createdAt: postSnapshot.data().createdAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      {
        error: '포스트 수정 실패!',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 },
    );
  }
}
