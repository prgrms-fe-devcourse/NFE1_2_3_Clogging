import { NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function POST(request: Request) {
  try {
    const { tagName } = await request.json();

    if (!tagName) {
      return NextResponse.json({ error: '태그 이름 없음!' }, { status: 400 });
    }

    const tagsRef = collection(db, 'tags');
    const tagsQuery = query(tagsRef, where('name', '==', tagName));
    const existingTagsSnapshot = await getDocs(tagsQuery);

    if (!existingTagsSnapshot.empty) {
      return NextResponse.json(
        { error: '이미 존재하는 태그!' },
        { status: 409 },
      );
    }

    const newTag = {
      name: tagName,
    };
    const docRef = await addDoc(tagsRef, newTag);

    return NextResponse.json(
      { message: '태그 생성 성공!', tag: { id: docRef.id, ...newTag } },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: '태그 생성 실패!' }, { status: 500 });
  }
}
