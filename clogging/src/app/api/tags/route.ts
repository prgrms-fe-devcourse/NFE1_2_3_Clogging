import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function GET() {
  try {
    const tagsRef = collection(db, 'tags');
    const tagsSnapshot = await getDocs(tagsRef);

    const tags = tagsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { message: '태그 조회 성공!', tags },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: '태그 조회 실패!' }, { status: 500 });
  }
}
