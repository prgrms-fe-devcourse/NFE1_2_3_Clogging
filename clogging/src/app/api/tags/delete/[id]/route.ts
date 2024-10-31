import { NextResponse } from 'next/server';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const tagId = params.id;

    if (!tagId) {
      return NextResponse.json(
        { error: '태그 ID가 필요합니다!' },
        { status: 400 },
      );
    }

    const tagRef = doc(db, 'tags', tagId);
    await deleteDoc(tagRef);

    return NextResponse.json(
      { message: '태그 삭제 성공!', deletedTagId: tagId },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: '태그 삭제 실패!' }, { status: 500 });
  }
}
