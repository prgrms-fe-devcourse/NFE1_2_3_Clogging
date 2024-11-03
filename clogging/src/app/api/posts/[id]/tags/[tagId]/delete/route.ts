import { db } from '@/shared/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; tagId: string } },
) {
  try {
    const { id: postId, tagId } = params;

    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (!postDoc.exists()) {
      return NextResponse.json(
        { error: '포스트가 존재하지 않음!' },
        { status: 404 },
      );
    }

    const tagDoc = await getDoc(doc(db, 'tags', tagId));
    if (!tagDoc.exists()) {
      return NextResponse.json(
        { error: '태그가 존재하지 않음!' },
        { status: 404 },
      );
    }

    const tagName = tagDoc.data().name;
    const postRef = doc(db, 'posts', postId);
    const tagRef = doc(db, 'tags', tagId);

    await updateDoc(postRef, {
      tags: arrayRemove(tagName),
    });

    await updateDoc(tagRef, {
      count: increment(-1),
    });

    return NextResponse.json(
      { message: '해당 게시물의 태그 삭제 성공!' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: '해당 게시물의 태그 삭제 실패!',
      },
      { status: 500 },
    );
  }
}
