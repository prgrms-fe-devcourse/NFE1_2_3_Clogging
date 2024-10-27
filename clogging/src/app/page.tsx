import {
  HomeStyleWrapper,
  DarkModeImage,
  CodeBlock,
  DeployButton,
  DocsButton,
  FooterLink,
} from '@/shared/ui/layout/HomeStyleWrapper';

export default function Home() {
  return (
    <HomeStyleWrapper>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <DarkModeImage
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing <CodeBlock>src/app/page.tsx</CodeBlock>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <DeployButton />
          <DocsButton />
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <FooterLink
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          icon="/file.svg"
          text="Learn"
        />
        <FooterLink
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          icon="/window.svg"
          text="Examples"
        />
        <FooterLink
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          icon="/globe.svg"
          text="Go to nextjs.org →"
        />
      </footer>
    </HomeStyleWrapper>
  );
}
