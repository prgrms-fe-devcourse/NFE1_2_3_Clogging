import { NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const replyId = searchParams.get('replyId');
    const postId = searchParams.get('postId');
    const { content, password } = await request.json();

    if (!commentId || !replyId || !postId || !content || !password) {
      return NextResponse.json(
        {
          error:
            'commentId, replyId, postId, content, password 중에 비어있는 값이 있음!',
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

    const replySnap = await getDoc(replyRef);

    if (!replySnap.exists()) {
      return NextResponse.json({ error: '답글 없음!' }, { status: 404 });
    }

    const replyData = replySnap.data();
    if (replyData.password !== password) {
      return NextResponse.json({ error: '비밀번호 불일치!' }, { status: 403 });
    }

    const updatedAt = Timestamp.now();

    await updateDoc(replyRef, {
      content: content,
      updatedAt: updatedAt,
    });

    const updatedAtDate = updatedAt.toDate();
    const formattedUpdatedAt = `${updatedAtDate.getFullYear()}${String(
      updatedAtDate.getMonth() + 1,
    ).padStart(2, '0')}${String(updatedAtDate.getDate()).padStart(2, '0')}`;

    const createdAtDate = replyData.createdAt.toDate();
    const formattedCreatedAt = `${createdAtDate.getFullYear()}${String(
      createdAtDate.getMonth() + 1,
    ).padStart(2, '0')}${String(createdAtDate.getDate()).padStart(2, '0')}`;

    return NextResponse.json(
      {
        message: '답글 수정 성공!',
        reply: {
          id: replyId,
          postId,
          content,
          author: replyData.author,
          createdAt: formattedCreatedAt,
          updatedAt: formattedUpdatedAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: '답글 수정 실패!' }, { status: 500 });
  }
}
