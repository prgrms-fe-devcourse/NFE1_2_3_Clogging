import { db } from '@/shared/lib/firebase';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const replyId = searchParams.get('replyId');
    const postId = searchParams.get('postId');

    if (!commentId || !replyId || !postId) {
      return NextResponse.json(
        { error: 'commentId, replyId, postId 중에 비어있는 값이 있음!' },
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

    // 비밀번호 체크 없이 바로 삭제
    await deleteDoc(replyRef);

    return NextResponse.json(
      {
        message: '답글 삭제 성공!',
        deletedReply: { id: replyId, commentId, postId },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: '답글 삭제 실패!' }, { status: 500 });
  }
}
