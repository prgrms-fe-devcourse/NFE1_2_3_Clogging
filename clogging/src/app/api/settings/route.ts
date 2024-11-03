// app/api/settings/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/shared/lib/firebase'; // Adjust the import path as necessary
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

interface BlogSettings {
  id?: string;
  profileImage: string | null;
  nickname: string;
  description: string;
  favicon: string | null;
  bannerImage: string | null;
}

export async function GET() {
  try {
    const settingsCollection = collection(db, 'settings');
    const snapshot = await getDocs(settingsCollection);

    const settings: BlogSettings[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogSettings[];

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.error();
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...settingsToUpdate } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required to update settings' },
        { status: 400 },
      );
    }

    const settingsDocRef = doc(db, 'settings', id);
    await updateDoc(settingsDocRef, settingsToUpdate);

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.error();
  }
}
