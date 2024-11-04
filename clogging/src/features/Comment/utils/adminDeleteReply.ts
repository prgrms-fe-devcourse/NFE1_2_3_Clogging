export async function adminDeleteReply(
  commentId: string,
  replyId: string,
  postId: string,
  password: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/comments/${commentId}/delete?replyId=${replyId}&postId=${postId}&password=${password}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete reply');
    }

    return true;
  } catch (error) {
    console.error('Error deleting reply:', error);
    return false;
  }
}
