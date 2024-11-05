// 제목, 작성일 등

import { Post } from '@/features/Post/types';
import { storage } from '@/shared/lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const Content = ({ post }: { post: Post }) => {
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);

  useEffect(() => {
    const loadThumbnails = async () => {
      if (!post.image?.length) return;

      try {
        const urls = await Promise.all(
          post.image.map(async (imagePath) => {
            try {
              // 전체 URL인 경우 직접 사용
              if (imagePath.startsWith('https://')) {
                return imagePath;
              }

              // Firebase Storage에서 URL 가져오기
              const imageRef = ref(storage, `posts/${imagePath}`);
              const url = await getDownloadURL(imageRef);
              return url;
            } catch (error) {
              console.error(`이미지 로드 실패 (${imagePath}):`, error);
              return '/images/card-thumbnail.png';
            }
          }),
        );
        setThumbnailUrls(urls);
      } catch (error) {
        console.error('이미지 로드 실패:', error);
        setThumbnailUrls(post.image.map(() => '/images/card-thumbnail.png'));
      }
    };

    loadThumbnails();
  }, [post.image]);

  return (
    <div className="mt-8">
      {thumbnailUrls.map((url, index) => (
        <Image
          key={index}
          src={url}
          alt={`${post.title} - 이미지 ${index + 1}`}
          width={1200}
          height={400}
          className="w-auto h-auto object-contain rounded-lg mb-8 m-auto"
        />
      ))}
      <div id="post-content">{post.content}</div>
    </div>
  );
};
