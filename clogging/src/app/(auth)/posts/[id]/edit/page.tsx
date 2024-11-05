import { getPost } from '@/features/Post/api/postApi';
import EditPostEditor from '@/features/Post/ui/edit/EditPostEditor';

async function EditPostPage({ params }: { params: { id: string } }) {
  try {
    const resolvedParams = await params;
    const { id: postId } = resolvedParams;

    if (!postId) {
      throw new Error('Post ID is required');
    }

    const postData = await getPost(postId);
    console.log('포스트 데이터입니다. ', postData);

    return <EditPostEditor post={postData} />;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to load post');
  }
}

export default EditPostPage;
