import { NextResponse } from 'next/server';
import { db } from '@/shared/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const categoryId = params.id;

  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: '카테고리 이름이 필요합니다.' },
        { status: 400 },
      );
    }

    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, { name });

    return NextResponse.json(
      { message: '카테고리 이름이 업데이트되었습니다.' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: '카테고리 이름 업데이트 실패!' },
      { status: 500 },
    );
  }
}
