import { NextResponse } from 'next/server';
import { db } from '@/shared/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const categoriesToUpdate = await request.json();

    // 각 카테고리를 업데이트
    const updatePromises = categoriesToUpdate.map(async (category) => {
      const categoryRef = doc(db, 'categories', category.id);
      return updateDoc(categoryRef, {
        order: category.order, // 새로운 order 값 업데이트
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json(
      { message: '카테고리 순서 업데이트 성공!' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: '카테고리 순서 업데이트 실패!' },
      { status: 500 },
    );
  }
}
