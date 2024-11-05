import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagName = searchParams.get('tagName');

    if (!tagName) {
      return NextResponse.json(
        { error: '태그 이름이 필요합니다.' },
        { status: 400 },
      );
    }

    const tagsRef = collection(db, 'tags');
    const q = query(tagsRef, where('name', '==', tagName));
    const querySnapshot = await getDocs(q);

    return NextResponse.json({ exists: !querySnapshot.empty }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '태그 확인 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
