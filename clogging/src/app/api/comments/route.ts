import { NextResponse } from 'next/server';
import { db } from '@/shared/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json(
      { error: 'postId를 form-data에다가 넣으세여' },
      { status: 400 },
    );
  }

  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', postId));
    const querySnapshot = await getDocs(q);

    const comments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    // console.error('댓글 조회 에러:', error);
    return NextResponse.json({ error: '댓글 조회 실패!' }, { status: 500 });
  }
}
