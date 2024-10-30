import { NextResponse } from 'next/server';
import { db } from '@/shared/lib/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';

interface Params {
  id: string;
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const categoryId = params.id;

    if (!categoryId) {
      return NextResponse.json(
        { error: '카테고리 id 비어있음!' },
        { status: 400 },
      );
    }

    const categoryRef = doc(db, 'categories', categoryId);
    const categorySnapshot = await getDoc(categoryRef);

    if (!categorySnapshot.exists()) {
      return NextResponse.json(
        { error: '해당하는 카테고리 없음!' },
        { status: 404 },
      );
    }

    await deleteDoc(categoryRef);

    return NextResponse.json(
      {
        message: '카테고리 삭제 성공!',
        id: categoryId,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: '카테고리 삭제 실패!' }, { status: 500 });
  }
}
