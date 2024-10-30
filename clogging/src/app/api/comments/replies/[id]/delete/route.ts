import { NextResponse } from 'next/server';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const replyId = searchParams.get('replyId');
    const postId = searchParams.get('postId');
    const password = searchParams.get('password');

    if (!commentId || !replyId || !postId || !password) {
      return NextResponse.json(
        {
          error:
            'commentId, replyId, postId, password 중에 비어있는 값이 있음!',
        },
        { status: 400 },
      );
    }

    const replyRef = doc(
      db,
      'posts',
      postId,
      'comments',
      commentId,
      'replies',
      replyId,
    );
    const replySnapshot = await getDoc(replyRef);

    if (!replySnapshot.exists()) {
      return NextResponse.json({ error: '답글 없음' }, { status: 404 });
    }

    const replyData = replySnapshot.data();

    if (replyData.password !== password) {
      return NextResponse.json({ error: '비밀번호 불일치!' }, { status: 403 });
    }

    await deleteDoc(replyRef);

    return NextResponse.json(
      {
        message: '답글 삭제 성공!',
        deletedReply: {
          id: replyId,
          commentId,
          postId,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: '답글 삭제 실패!' }, { status: 500 });
  }
}
