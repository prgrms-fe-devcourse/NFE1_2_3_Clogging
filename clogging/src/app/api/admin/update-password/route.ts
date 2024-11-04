import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function PATCH(request: Request) {
  try {
    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json(
        { error: '비밀번호는 4자리 이상이어야 합니다.' },
        { status: 400 },
      );
    }

    const adminRef = doc(db, 'admin', 'credentials');
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) {
      return NextResponse.json(
        { error: '관리자 설정이 존재하지 않습니다.' },
        { status: 404 },
      );
    }

    await updateDoc(adminRef, {
      password: newPassword,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: '비밀번호가 성공적으로 변경되었습니다.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('비밀번호 변경 에러:', error);
    return NextResponse.json(
      { error: '비밀번호 변경 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
