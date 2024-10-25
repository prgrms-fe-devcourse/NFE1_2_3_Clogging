import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

console.log('API 키:', process.env.NEXT_PUBLIC_API_KEY);
console.log('이메일:', process.env.NEXT_PUBLIC_ADMIN_EMAIL);

const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email !== adminEmail) {
    return NextResponse.json(
      { error: '접근이 허가되지 않음' },
      { status: 401 },
    );
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const token = await userCredential.user.getIdToken();

    return NextResponse.json({ token });
  } catch (error) {
    // console.error('인증 실패:', error.message);
    return NextResponse.json(
      { error: '인증 실패', details: error.message },
      { status: 401 },
    );
  }
}
