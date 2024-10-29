import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const { content, password } = await request.json();

    if (!commentId || !content || !password) {
      return NextResponse.json(
        { error: 'commentId, content, password 중에 비어있는 값이 있음!' },
        { status: 400 },
      );
    }

    const commentRef = doc(db, 'comments', commentId);
    const commentSnapshot = await getDoc(commentRef);
    if (!commentSnapshot.exists()) {
      return NextResponse.json(
        { error: '댓글 존재하지 않음!' },
        { status: 404 },
      );
    }

    const commentData = commentSnapshot.data();
    if (commentData.password !== password) {
      return NextResponse.json({ error: '비밀번호 불일치!' }, { status: 403 });
    }

    await updateDoc(commentRef, { content });

    return NextResponse.json(
      {
        message: '댓글 수정 성공!',
        updatedComment: { id: commentId, content },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: '댓글 수정 실패!' }, { status: 500 });
  }
}
