import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function GET() {
  try {
    const categoriesRef = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoriesRef);

    if (categorySnapshot.empty) {
      return NextResponse.json(
        {
          message: '카테고리가 없습니다.',
          categories: [],
        },
        { status: 200 },
      );
    }

    const categories = categorySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 이름 순으로 정렬 (만약 name 필드가 있다면)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories.sort((a: any, b: any) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return NextResponse.json(
      {
        message: '카테고리 조회 성공!',
        categories: categories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: '카테고리 조회 실패!' }, { status: 500 });
  }
}
