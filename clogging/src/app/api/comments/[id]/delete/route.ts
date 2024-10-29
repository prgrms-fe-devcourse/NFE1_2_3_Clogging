import { NextResponse } from 'next/server';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const password = searchParams.get('password');

    if (!commentId || !password) {
      return NextResponse.json(
        { error: 'commentId나 password가 비어있음!' },
        { status: 400 },
      );
    }

    const commentRef = doc(db, 'comments', commentId);
    const commentSnapshot = await getDoc(commentRef);

    if (!commentSnapshot.exists()) {
      return NextResponse.json({ error: '댓글 없음' }, { status: 404 });
    }

    const commentData = commentSnapshot.data();

    if (commentData.password !== password) {
      return NextResponse.json({ error: '비밀번호 불일치!' }, { status: 403 });
    }

    await deleteDoc(commentRef);

    return NextResponse.json({ message: '댓글 삭제 성공!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '댓글 삭제 실패!' }, { status: 500 });
  }
}
