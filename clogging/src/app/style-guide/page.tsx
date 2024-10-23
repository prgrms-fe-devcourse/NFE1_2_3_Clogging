'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/common/Button';
import { Input } from '@/components/ui/common/Input';
import { Badge } from '@/components/ui/common/Badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/common/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { Navigation } from '@/components/ui/Navigation';
import { FormSectionItem, Textarea } from '@/components/ui/Form';

const StyleGuide = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Design tokens
  const designTokens: any = {
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        500: '#6b7280',
        700: '#374151',
        900: '#111827',
      },
      success: '#22c55e',
      error: '#ef4444',
    },
  } as const;

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
    >
      {/* Style Guide */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-16">
        {/* Header Section */}
        <section>
          <h1 className="text-4xl font-bold mb-4">Clogging 스타일 가이드</h1>
          <p
            className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            일관된 사용자 경험을 위한 스타일 가이드
          </p>
        </section>

        {/* Colors Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Colors */}
            <div className="space-y-5">
              <h3 className="font-medium mb-3">Primary</h3>
              {[500, 600, 700].map((shade) => (
                <div key={shade} className="space-y-2">
                  <div
                    className="h-12 rounded-lg"
                    style={{
                      backgroundColor: designTokens.colors.primary[shade],
                    }}
                  />
                  <p className="text-sm font-medium">Primary {shade}</p>
                  <p
                    className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {designTokens.colors.primary[shade]}
                  </p>
                </div>
              ))}
            </div>

            {/* Gray Scale */}
            <div className="space-y-5">
              <h3 className="font-medium mb-3">Grays</h3>
              {[200, 500, 700].map((shade) => (
                <div key={shade} className="space-y-2">
                  <div
                    className="h-12 rounded-lg"
                    style={{ backgroundColor: designTokens.colors.gray[shade] }}
                  />
                  <p className="text-sm font-medium">Gray {shade}</p>
                  <p
                    className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {designTokens.colors.gray[shade]}
                  </p>
                </div>
              ))}
            </div>

            {/* System Colors */}
            <div className="space-y-5">
              <h3 className="font-medium mb-3">System</h3>
              <div className="space-y-2">
                <div
                  className="h-12 rounded-lg"
                  style={{ backgroundColor: designTokens.colors.success }}
                />
                <p className="text-sm font-medium">Success</p>
                <p
                  className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  {designTokens.colors.success}
                </p>
              </div>
              <div className="space-y-2">
                <div
                  className="h-12 rounded-lg"
                  style={{ backgroundColor: designTokens.colors.error }}
                />
                <p className="text-sm font-medium">Error</p>
                <p
                  className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  {designTokens.colors.error}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Typography</h2>
          <div
            className={`space-y-8 rounded-lg shadow-sm p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            {[
              {
                level: 'Heading 1',
                size: 'text-4xl',
                weight: 'font-bold',
                specs: '36px / 40px / Bold',
              },
              {
                level: 'Heading 2',
                size: 'text-3xl',
                weight: 'font-semibold',
                specs: '30px / 36px / Semibold',
              },
              {
                level: 'Heading 3',
                size: 'text-2xl',
                weight: 'font-medium',
                specs: '24px / 32px / Medium',
              },
              {
                level: 'Body Text',
                size: 'text-base',
                weight: 'font-normal',
                specs: '16px / 24px / Regular',
              },
              {
                level: 'Small Text',
                size: 'text-sm',
                weight: 'font-normal',
                specs: '14px / 20px / Regular',
              },
            ].map((type) => (
              <div key={type.level}>
                <div className={`${type.size} ${type.weight} mb-2`}>
                  {type.level}
                </div>
                <p
                  className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  Font Size: {type.specs}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
          <Card>
            {/* Variants */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-2">
                    <Button variant="primary">Primary Button</Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Primary
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button variant="secondary">Secondary Button</Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Secondary
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline">Outline Button</Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Outline
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button variant="ghost">Ghost Button</Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ghost
                    </p>
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sizes</h3>
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="space-y-2">
                    <Button size="lg">Large Button</Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Large
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button size="default">Default Button</Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Default
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button size="sm">Small Button</Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Small
                    </p>
                  </div>
                </div>
              </div>

              {/* States */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">States</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-2">
                    <Button disabled>Disabled Button</Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Disabled
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button loading>Loading Button</Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Loading
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards & Badges Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Cards & Badges</h2>

          {/* Badges */}
          <div className="space-y-6 mb-8">
            <h3 className="text-xl font-medium">Badges</h3>
            <Card>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <Badge>Default Badge</Badge>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Default
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">Secondary Badge</Badge>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Secondary
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="success">Success Badge</Badge>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Success
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="error">Error Badge</Badge>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Error
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Cards */}

          <div className="space-y-6">
            <h3 className="text-xl font-medium">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Card */}
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>기본 카드</CardTitle>
                    <CardDescription>
                      제목과 설명이 있는 기본적인 카드입니다.
                    </CardDescription>
                  </div>
                  <Badge>New</Badge>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300">
                      카드 내용이 들어가는 영역입니다.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Card */}
              <Card>
                <CardContent>
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 items-start justify-between mb-2">
                        <Badge variant="secondary">Featured</Badge>
                        <CardTitle>이미지 카드</CardTitle>
                      </div>
                      <CardDescription className="mb-4">
                        이미지가 포함된 카드 스타일입니다.
                      </CardDescription>
                      <div className="flex gap-2">
                        <Badge>Java Script</Badge>
                        <Badge>React</Badge>
                      </div>
                    </div>
                    <div className="w-3/12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <img
                        src="/api/placeholder/96/96"
                        alt="Featured"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Card */}
              <Card className="transition-all duration-200 hover:shadow-md cursor-pointer">
                <div className="space-y-4">
                  <CardHeader>
                    <CardTitle>인터랙티브 카드</CardTitle>
                    <Badge variant="success">Active</Badge>
                  </CardHeader>
                  <CardDescription>
                    호버 효과가 적용된 인터랙티브 카드입니다.
                  </CardDescription>
                  <CardContent>
                    <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        인터랙티브 컨텐츠
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="secondary">2024.10.23</Badge>
                    <Button variant="ghost" size="sm">
                      자세히 보기
                    </Button>
                  </CardFooter>
                </div>
              </Card>

              {/* List Card */}
              <Card>
                <CardHeader>
                  <CardTitle>리스트 카드</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">리스트 아이템 {item}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            간단한 설명이 들어갑니다.
                          </p>
                        </div>
                        <Badge variant="secondary">{item}번</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Input Elements Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Input</h2>
          <Card>
            <div className="space-y-4">
              {/* 기본 입력 */}
              <div className="space-y-2">
                <Input placeholder="기본 입력창" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  기본 입력창
                </p>
              </div>

              {/* 비활성화 입력 */}
              <div className="space-y-2">
                <Input placeholder="비활성화 입력창" disabled />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  비활성화
                </p>
              </div>

              {/* 읽기 전용 입력 */}
              <div className="space-y-2">
                <Input value="읽기 전용 입력창" readOnly />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  읽기 전용
                </p>
              </div>

              {/* 에러 상태 입력 */}
              <div className="space-y-2">
                <Input
                  placeholder="에러 상태 입력창"
                  className="border-red-500 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-sm text-red-500">에러 메시지가 표시됩니다</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Form Elements Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">폼 요소</h2>
          <Card>
            <div className="space-y-6">
              {/* 기본 입력 */}
              <FormSectionItem title="기본 입력">
                <Input placeholder="기본 입력창" />
              </FormSectionItem>

              {/* 검색 */}
              <FormSectionItem title="검색">
                <SearchBar />
              </FormSectionItem>

              {/* 여러 줄 입력 */}
              <FormSectionItem title="여러 줄 입력">
                <Textarea className="h-32" placeholder="여러 줄 입력" />
              </FormSectionItem>

              {/* 비활성화 상태 */}
              <FormSectionItem title="비활성화 상태">
                <div className="space-y-4">
                  <Input placeholder="비활성화된 입력창" disabled />
                  <Textarea
                    className="h-32"
                    placeholder="비활성화된 여러 줄 입력"
                    disabled
                  />
                </div>
              </FormSectionItem>
            </div>
          </Card>
        </section>

        {/* Navigation Example Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">네비게이션</h2>
          <Card>
            <Navigation />
          </Card>
        </section>

        {/* Search Components */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">검색</h2>
          <Card>
            <div className="space-y-6">
              {/* 기본 검색바 */}
              <div className="space-y-2">
                <SearchBar onSearch={console.log} />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  기본 검색바
                </p>
              </div>

              {/* 커스텀 플레이스홀더 */}
              <div className="space-y-2">
                <SearchBar
                  placeholder="제품을 검색하세요"
                  buttonText="찾기"
                  onSearch={console.log}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  커스텀 텍스트
                </p>
              </div>

              {/* 비활성화 상태 */}
              <div className="space-y-2">
                <div className="opacity-50 pointer-events-none">
                  <SearchBar placeholder="비활성화 상태" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  비활성화 상태
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default StyleGuide;
