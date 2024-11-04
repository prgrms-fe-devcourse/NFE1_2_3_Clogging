import { NextResponse } from 'next/server';
import { verifyAdminPassword } from '../route';
export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 },
      );
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: '잘못된 비밀번호입니다.' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: '관리자 인증 성공',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('관리자 인증 에러:', error);
    return NextResponse.json(
      { error: '관리자 인증 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
