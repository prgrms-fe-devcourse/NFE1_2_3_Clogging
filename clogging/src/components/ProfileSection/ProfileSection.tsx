import Image from 'next/image';
import { BLOG_OWNER } from '@/constants/profile';

export const ProfileSection = () => {
  return (
    <div className="mb-7 pb-4 border-b border-border dark:border-border">
      <div className="flex items-center gap-8 py-6 container">
        {/* 프로필 이미지 컨테이너 */}
        <div className="relative w-32 h-32 flex-shrink-0 rounded-full">
          <div className="absolute inset-0 rounded-full overflow-hidden bg-muted dark:bg-muted">
            {BLOG_OWNER.imageUrl ? (
              <Image
                src={BLOG_OWNER.imageUrl}
                alt={`${BLOG_OWNER.name}의 프로필`}
                fill
                sizes="(max-width: 128px) 100vw, 128px"
                priority
                className="rounded-full object-cover"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-full bg-secondary dark:bg-secondary-dark">
                <span className="text-3xl text-foreground dark:text-foreground">
                  {BLOG_OWNER.name[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-heading font-bold mb-3">
            {BLOG_OWNER.name}
          </h2>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground">
            {BLOG_OWNER.description}
          </p>
        </div>
      </div>
    </div>
  );
};
