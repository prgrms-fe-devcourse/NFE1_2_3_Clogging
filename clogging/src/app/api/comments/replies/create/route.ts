import { NextResponse } from 'next/server';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function POST(request: Request) {
  try {
    const { content, author, password, postId, commentId } =
      await request.json();

    if (!content || !author || !password || !commentId || !postId) {
      return NextResponse.json({ error: '필드가 비어있음!' }, { status: 400 });
    }

    const newReply = {
      postId,
      author,
      content,
      password,
      createdAt: Timestamp.now(),
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

    const createdAtDate = newReply.createdAt.toDate();
    const formattedCreatedAt = `${createdAtDate.getFullYear()}${String(
      createdAtDate.getMonth() + 1,
    ).padStart(2, '0')}${String(createdAtDate.getDate()).padStart(2, '0')}`;

    return NextResponse.json(
      {
        message: '답글 작성 성공!',
        reply: {
          id: replyDoc.id,
          postId: newReply.postId,
          author: newReply.author,
          content: newReply.content,
          createdAt: formattedCreatedAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: '답글 작성 실패!' }, { status: 500 });
  }
}
