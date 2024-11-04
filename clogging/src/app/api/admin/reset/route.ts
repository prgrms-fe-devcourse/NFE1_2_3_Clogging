import { NextResponse } from 'next/server';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function POST(request: Request) {
  try {
    const adminRef = doc(db, 'admin', 'credentials');

    // 기존 문서 삭제만 수행
    await deleteDoc(adminRef);

    return NextResponse.json(
      {
        success: true,
        message: '관리자 설정이 초기화되었습니다.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('초기화 에러:', error);
    return NextResponse.json(
      { error: '초기화 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
