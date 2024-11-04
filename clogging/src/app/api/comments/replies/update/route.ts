import { NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const replyId = searchParams.get('replyId');
    const postId = searchParams.get('postId');
    const { content, password, isPrivate } = await request.json();

    if (!commentId || !replyId || !postId || !content || !password) {
      return NextResponse.json(
        { error: '필수 입력값이 누락되었습니다.' },
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
      return NextResponse.json(
        { error: '답글을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const replyData = replySnap.data();
    if (replyData.password !== password) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 403 },
      );
    }

    const updatedAt = Timestamp.now();
    await updateDoc(replyRef, {
      content,
      updatedAt,
      isPrivate: isPrivate ?? replyData.isPrivate ?? false,
    });

    return NextResponse.json(
      {
        message: '답글이 수정되었습니다.',
        reply: {
          id: replyId,
          postId,
          content,
          author: replyData.author,
          createdAt: replyData.createdAt
            .toDate()
            .toISOString()
            .split('T')[0]
            .replace(/-/g, ''),
          updatedAt: updatedAt
            .toDate()
            .toISOString()
            .split('T')[0]
            .replace(/-/g, ''),
          isPrivate: isPrivate ?? replyData.isPrivate ?? false,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: '답글 수정에 실패했습니다.' },
      { status: 500 },
    );
  }
}
