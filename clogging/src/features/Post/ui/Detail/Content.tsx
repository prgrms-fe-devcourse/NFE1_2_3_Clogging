// 제목, 작성일 등

import { Post } from '@/features/Post/types';
import { storage } from '@/shared/lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const Content = ({ post }: { post: Post }) => {
  console.log('포스트입니다. ', post.image);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    '/images/card-thumbnail.png',
  );

  useEffect(() => {
    const loadThumbnail = async () => {
      if (!post.image?.length) return;

      try {
        // 전체 URL인 경우 직접 사용
        if (post.image[0].startsWith('https://')) {
          setThumbnailUrl(post.image[0]);
          return;
        }

        // 파일명만 있는 경우 Storage에서 URL 가져오기
        if (post.image[0].length > 2) {
          // 최소 유효성 검사
          const imageRef = ref(storage, `posts/${post.image[0]}`);
          const url = await getDownloadURL(imageRef);
          setThumbnailUrl(url);
        }
      } catch (error) {
        console.error('썸네일 로드 실패:', error);
        setThumbnailUrl('/images/card-thumbnail.png');
      }
    };

    loadThumbnail();
  }, [post.image]);

  return (
    <div className="mt-8">
      {post.image && (
        <Image
          src={thumbnailUrl}
          alt={post.title}
          width={1200}
          height={400}
          className="w-auto h-auto object-contain rounded-lg mb-8 m-auto"
        />
      )}
      {post.content}
    </div>
  );
};
