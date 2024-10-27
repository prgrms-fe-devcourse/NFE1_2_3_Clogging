import { NextResponse } from 'next/server';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: '포스트 아이디가 필요합니다.' },
        { status: 400 },
      );
    }

    const postRef = doc(db, 'posts', id);
    await deleteDoc(postRef);

    return NextResponse.json({ message: '포스트 삭제 성공!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '포스트 삭제 실패!' }, { status: 500 });
  }
}
