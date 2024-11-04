import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const postId = searchParams.get('postId');
    const { content, password, isPrivate } = await request.json();

    if (!commentId || !postId || !content || !password) {
      return NextResponse.json(
        { error: '필수 입력값이 누락되었습니다.' },
        { status: 400 },
      );
    }

    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    const commentSnapshot = await getDoc(commentRef);

    if (!commentSnapshot.exists()) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const commentData = commentSnapshot.data();
    if (commentData.password !== password) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 403 },
      );
    }

    const updatedData = {
      content,
      isPrivate: Boolean(isPrivate),
    };

    await updateDoc(commentRef, updatedData);

    return NextResponse.json({
      message: '댓글이 수정되었습니다.',
      updatedComment: {
        id: commentId,
        postId,
        ...updatedData,
        author: commentData.author,
        createdAt: commentData.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: '댓글 수정에 실패했습니다.' },
      { status: 500 },
    );
  }
}
