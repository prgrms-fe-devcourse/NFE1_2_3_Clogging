import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { NextResponse } from 'next/server';

const MAX_TAGS = 5;

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { tagIds } = await request.json();
    const postRef = doc(db, 'posts', params.id);

    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) {
      return NextResponse.json({ error: '포스트 찾지 못함' }, { status: 404 });
    }

    const currentTags = postDoc.data().tags || [];
    const newTagsCount = new Set([...currentTags, ...tagIds]).size;

    if (newTagsCount > MAX_TAGS) {
      return NextResponse.json(
        { error: '태그 최대 5개까지 추가 가능!' },
        { status: 400 },
      );
    }

    const tagNames = await Promise.all(
      tagIds.map(async (tagId: string) => {
        const tagDoc = await getDoc(doc(db, 'tags', tagId));
        if (!tagDoc.exists()) {
          throw new Error(`태그 아이디 : ${tagId} 찾을 수 없음!`);
        }
        return tagDoc.data().name;
      }),
    );

    await updateDoc(postRef, {
      tags: arrayUnion(...tagNames),
    });

    await Promise.all(
      tagIds.map(async (tagId: string) => {
        const tagRef = doc(db, 'tags', tagId);
        await updateDoc(tagRef, {
          count: increment(1),
        });
      }),
    );

    return NextResponse.json(
      { message: '해당 게시물의 태그 추가 성공!' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: '해당 게시물의 태그 추가 실패!' },
      { status: 500 },
    );
  }
}
