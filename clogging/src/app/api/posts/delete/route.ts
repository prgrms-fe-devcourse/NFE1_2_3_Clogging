import { NextResponse } from 'next/server';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: '포스트 ID가 필요합니다.' },
        { status: 400 },
      );
    }

    const postRef = doc(db, 'posts', id);
    await deleteDoc(postRef);

    return NextResponse.json({ message: '포스트 삭제 성공!' });
  } catch (error) {
    return NextResponse.json(
      { error: '포스트 삭제에 실패했습니다.' },
      { status: 500 },
    );
  }
}
