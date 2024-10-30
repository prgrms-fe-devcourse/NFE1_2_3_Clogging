import { NextResponse } from 'next/server';
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const postId = searchParams.get('postId');
    const password = searchParams.get('password');

    if (!commentId || !postId || !password) {
      return NextResponse.json(
        { error: 'commentId, postId, password 중에 비어있는 값이 있음!' },
        { status: 400 },
      );
    }

    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    const commentSnapshot = await getDoc(commentRef);

    if (!commentSnapshot.exists()) {
      return NextResponse.json({ error: '댓글 없음' }, { status: 404 });
    }

    const commentData = commentSnapshot.data();

    if (commentData.password !== password) {
      return NextResponse.json({ error: '비밀번호 불일치!' }, { status: 403 });
    }

    // 1030 추가 - 답글 컬렉션까지 삭제
    const repliesRef = collection(
      db,
      'posts',
      postId,
      'comments',
      commentId,
      'replies',
    );
    const repliesSnapshot = await getDocs(repliesRef);

    const deleteReplyPromises = repliesSnapshot.docs.map((replyDoc) =>
      deleteDoc(replyDoc.ref),
    );
    await Promise.all(deleteReplyPromises);

    await deleteDoc(commentRef);

    return NextResponse.json(
      {
        message: '댓글 및 답글 삭제 성공!',
        deletedComment: {
          id: commentId,
          postId,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: '댓글 삭제 실패!' }, { status: 500 });
  }
}
