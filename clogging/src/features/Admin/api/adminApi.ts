export const updateAdminPassword = async (
  newPassword: string,
): Promise<boolean> => {
  try {
    const response = await fetch('/api/admin/update-password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '비밀번호 변경에 실패했습니다.');
    }

    return true;
  } catch (error) {
    console.error('비밀번호 변경 에러:', error);
    throw error;
  }
};
