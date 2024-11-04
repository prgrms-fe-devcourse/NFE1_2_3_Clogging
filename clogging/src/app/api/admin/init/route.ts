import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

const INITIAL_PASSWORD = '1234'; // 초기 비밀번호

export async function POST(request: Request) {
  console.log('초기 설정 API 호출됨');

  try {
    const adminRef = doc(db, 'admin', 'credentials');
    const adminDoc = await getDoc(adminRef);

    // 이미 설정되어 있으면 초기 설정 불가
    if (adminDoc.exists()) {
      return NextResponse.json(
        {
          error:
            '이미 관리자 설정이 되어 있습니다. 초기화가 필요한 경우 리셋 기능을 사용해주세요.',
        },
        { status: 400 },
      );
    }

    // 최초 설정만 가능
    await setDoc(adminRef, {
      password: INITIAL_PASSWORD,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isInitialSetup: true, // 초기 설정 표시
    });

    console.log('초기 비밀번호 설정 완료');

    return NextResponse.json(
      {
        success: true,
        message: '관리자 초기 설정이 완료되었습니다.',
        initialPassword: INITIAL_PASSWORD,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('초기 설정 에러:', error);
    return NextResponse.json(
      { error: '초기 설정 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
