import { IntroButtons } from '@/features/Auth/ui/IntroButtons';
import {
  HomeStyleWrapper,
  DarkModeImage,
} from '@/shared/ui/layout/HomeStyleWrapper';

export default function IntroPage() {
  return (
    <HomeStyleWrapper>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <DarkModeImage
          src="/images/clogging-logo.png"
          alt="clogging logo"
          width={140}
          height={122}
          priority
          className="m-auto mb-7"
        />

        <IntroButtons />
      </main>
    </HomeStyleWrapper>
  );
}
