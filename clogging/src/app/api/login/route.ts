import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/shared/lib/firebase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (email !== adminEmail) {
      return NextResponse.json(
        { error: '접근이 허가되지 않음' },
        { status: 401 },
      );
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const token = await userCredential.user.getIdToken();

    return NextResponse.json({ email, token });
  } catch (error: any) {
    console.error('인증 실패:', error.message);
    return NextResponse.json(
      { error: '인증 실패', details: error.message },
      { status: 401 },
    );
  }
}
