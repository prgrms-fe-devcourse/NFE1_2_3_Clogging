import { NextResponse } from 'next/server';
import { setAdminPassword } from '../route';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || password.length < 4) {
      return NextResponse.json(
        { error: '유효하지 않은 비밀번호입니다.' },
        { status: 400 },
      );
    }

    const success = await setAdminPassword(password);

    if (!success) {
      throw new Error('비밀번호 설정에 실패했습니다.');
    }

    return NextResponse.json(
      { message: '비밀번호가 성공적으로 설정되었습니다.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('관리자 비밀번호 설정 에러:', error);
    return NextResponse.json(
      { error: '비밀번호 설정 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
