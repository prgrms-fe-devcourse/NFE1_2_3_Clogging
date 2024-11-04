import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export const useFetchSettings = () => {
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [settingsData, setSettingsData] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'settings'));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setSettingsId(querySnapshot.docs[0].id);
          setSettingsData(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return { settingsId, settingsData };
};
