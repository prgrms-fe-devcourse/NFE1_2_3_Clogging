import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: '카테고리명 없음!' }, { status: 400 });
    }

    const categoriesRef = collection(db, 'categories');
    const duplicateQuery = query(categoriesRef, where('name', '==', name));
    const duplicateCheck = await getDocs(duplicateQuery);

    if (!duplicateCheck.empty) {
      return NextResponse.json({ error: '카테고리명 중복!' }, { status: 409 });
    }

    const newCategory = {
      name,
      postIds: [],
      postCount: 0,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(categoriesRef, newCategory);

    return NextResponse.json(
      {
        message: '카테고리 생성 성공!',
        category: {
          id: docRef.id,
          ...newCategory,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: '카테고리 생성 실패!' }, { status: 500 });
  }
}