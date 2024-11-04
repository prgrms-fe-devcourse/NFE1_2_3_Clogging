import { NextResponse } from 'next/server';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function POST(request: Request) {
  try {
    const { content, author, password, postId, commentId, isPrivate } =
      await request.json();

    if (!content || !author || !password || !commentId || !postId) {
      return NextResponse.json({ error: '필드가 비어있음!' }, { status: 400 });
    }

    if (password.length !== 4 || isNaN(Number(password))) {
      return NextResponse.json(
        { error: '비밀번호는 숫자 4자리이어야 합니다!' },
        { status: 400 },
      );
    }

    const newReply = {
      postId,
      author,
      content,
      password,
      createdAt: Timestamp.now(),
      isPrivate: isPrivate || false,
    };

    const repliesRef = collection(
      db,
      'posts',
      postId,
      'comments',
      commentId,
      'replies',
    );
    const replyDoc = await addDoc(repliesRef, newReply);

    return NextResponse.json(
      {
        message: '답글 작성 성공!',
        reply: {
          id: replyDoc.id,
          postId: newReply.postId,
          author: newReply.author,
          content: newReply.content,
          createdAt: newReply.createdAt.toDate().toISOString(),
          isPrivate: newReply.isPrivate,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: '답글 작성 실패!' }, { status: 500 });
  }
}
