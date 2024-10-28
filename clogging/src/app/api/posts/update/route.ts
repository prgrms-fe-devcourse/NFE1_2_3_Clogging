import { NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { uploadImage } from '@/shared/lib/storage/uploadImage';

//1. 이미지만 삭제하는 경우
//2. 이미지 삭제와 새 이미지 추가
//3. 이미지 변경 없이 내용만 수정

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('postId') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File | null;
    const imagesToDeleteId = formData.get('imagesToDeleteId') as string;

    let imagesToDeleteArray: string[] = [];
    try {
      imagesToDeleteArray = imagesToDeleteId
        ? JSON.parse(imagesToDeleteId)
        : [];
    } catch (parseError) {
      console.error('Error parsing imagesToDeleteId:', parseError);
      return NextResponse.json(
        { error: 'Invalid imagesToDeleteId format' },
        { status: 400 },
      );
    }

    const postRef = doc(db, 'posts', id);
    const postSnapshot = await getDoc(postRef);

    if (!postSnapshot.exists()) {
      return NextResponse.json(
        { error: '해당 포스트를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const postData = postSnapshot.data();
    const existingImagePaths = postData?.image || [];

    const { updatedImageIds } = await uploadImage(
      image,
      existingImagePaths,
      imagesToDeleteArray,
    );

    const updatedData = {
      title,
      content,
      image: updatedImageIds,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(postRef, updatedData);

    return NextResponse.json(
      {
        message: '포스트 수정 성공!',
        post: { id, ...updatedData },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      {
        error: `포스트 수정 실패!`,
      },
      { status: 500 },
    );
  }
}
