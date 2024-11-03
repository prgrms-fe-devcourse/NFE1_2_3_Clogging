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
      {/* <div id="post-content">{post.content}</div> */}

      {/* 목차 테스트용 */}
      <div id="post-content">
        <h1>Next.js와 Firebase로 블로그 만들기 완벽 가이드</h1>
        <p>
          이 글에서는 Next.js와 Firebase를 사용하여 완벽한 블로그를 만드는
          방법을 단계별로 설명합니다.
        </p>

        <h2>1. 프로젝트 설정하기</h2>
        <p>
          먼저 Next.js 프로젝트를 설정하고 필요한 디펜던시들을 설치해보겠습니다.
        </p>

        <h3>1.1 Next.js 프로젝트 생성</h3>
        <p>create-next-app을 사용하여 새로운 프로젝트를 생성합니다.</p>

        <h3>1.2 Firebase 설정</h3>
        <p>Firebase 콘솔에서 새 프로젝트를 만들고 필요한 설정을 진행합니다.</p>

        <h2>2. 데이터베이스 구조 설계</h2>
        <p>
          효율적인 데이터 구조를 위해 Firestore 데이터베이스를 설계해보겠습니다.
        </p>

        <h3>2.1 컬렉션 구조</h3>
        <p>블로그에 필요한 주요 컬렉션들을 설계합니다.</p>

        <h4>2.1.1 Posts 컬렉션</h4>
        <p>게시글 정보를 저장하는 컬렉션 구조를 설명합니다.</p>

        <h4>2.1.2 Users 컬렉션</h4>
        <p>사용자 정보를 저장하는 컬렉션 구조를 설명합니다.</p>

        <h2>3. 인증 시스템 구현</h2>
        <p>
          Firebase Authentication을 사용하여 사용자 인증 시스템을 구현합니다.
        </p>

        <h2>4. 배포하기</h2>
        <p>완성된 블로그를 Vercel에 배포하는 방법을 알아봅니다.</p>

        <h3>4.1 배포 전 준비사항</h3>
        <p>배포 전에 확인해야 할 사항들을 체크합니다.</p>

        <h3>4.2 Vercel 배포 프로세스</h3>
        <p>Vercel을 통한 배포 프로세스를 단계별로 설명합니다.</p>
      </div>
    </div>
  );
};
