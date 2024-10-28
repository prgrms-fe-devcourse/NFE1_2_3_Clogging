import { NextResponse } from 'next/server';
import { db } from '@/shared/lib/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { postId, author, content, password } = await request.json();

    if (!postId || !author || !content || !password) {
      return NextResponse.json({ error: '값을 넣어주세요!' }, { status: 400 });
    }

    if (password.length !== 4 || isNaN(Number(password))) {
      return NextResponse.json(
        { error: '비밀번호는 숫자 4자리이어야 합니다!' },
        { status: 400 },
      );
    }

    const newComment = {
      postId,
      author,
      content,
      password: password,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'comments'), newComment);

    return NextResponse.json(
      {
        message: '댓글 작성 성공!',
        comment: {
          id: docRef.id,
          ...newComment,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('댓글 작성 에러:', error);
    return NextResponse.json({ error: '댓글 작성 실패!' }, { status: 500 });
  }
}
