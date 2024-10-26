import { NextResponse } from 'next/server';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title')?.toString();
    const content = formData.get('content')?.toString();
    const image = formData.get('image') as File | null;
    console.log(image);

    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용은 필수입니다.' },
        { status: 400 },
      );
    }

    let imageUrl = null;
    let imageToDeleteId = null;

    if (image) {
      if (!image.type.startsWith('image/')) {
        return NextResponse.json(
          { error: '이미지 파일만 업로드 가능합니다!' },
          { status: 400 },
        );
      }

      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (image.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: '이미지 크기는 5MB 이하로 첨부할 수 있습니다!' },
          { status: 400 },
        );
      }

      try {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${image.name}`;
        const storageRef = ref(storage, `posts/${fileName}`);

        await uploadBytes(storageRef, image);

        imageUrl = await getDownloadURL(storageRef);
        imageToDeleteId = `posts/${fileName}`; // 파이어베이스 storage에서 이미지 삭제할 때 사용할 ID
      } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
          { error: '이미지 업로드에 실패했습니다!' },
          { status: 500 },
        );
      }
    }

    const postData = {
      title,
      content,
      image: imageUrl,
      imageToDeleteId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Firestore에 포스트 추가
    const postRef = await addDoc(collection(db, 'posts'), postData);

    return NextResponse.json(
      {
        message: '포스트가 성공적으로 생성되었습니다.',
        postId: postRef.id,
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
    console.error('Post creation error:', error);
    return NextResponse.json(
      { error: '포스트 생성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
