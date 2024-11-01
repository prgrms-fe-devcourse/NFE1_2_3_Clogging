'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { usePostEditor } from '@/features/Post/lib/hooks/usePostEditor';
import { Button } from '@/shared/ui/common/Button';

const categories = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'react', label: '리액트' },
  { value: 'css', label: 'CSS' },
];

export const PostEditor: React.FC = () => {
  const {
    editorState,
    handleTitleChange,
    handleContentChange,
    handleCategoryChange,
    handleSaveDraft,
    handleSubmit,
    handleGoBack,
  } = usePostEditor();

  return (
    <div className="container mx-auto px-4 max-w-[1400px]">
      {/* 카테고리 선택 */}
      <select
        value={editorState.category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        style={{ width: '300px', height: '37px' }}
        className="mt-4 mb-[52px] px-4 border rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700"
      >
        <option value="">default</option>
        {categories.map((category) => (
          <option
            key={category.value}
            value={category.value}
            className="text-gray-900 dark:text-gray-100 appearance-none border-none outline-none bg-transparent"
            style={{
              backgroundColor: 'transparent',
            }}
          >
            {category.label}
          </option>
        ))}
      </select>

      {/* 제목 입력 */}
      <div className="flex flex-col items-center">
        <input
          type="text"
          value={editorState.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="제목을 입력해주세요."
          className="w-full text-[35px] font-bold text-center appearance-none border-none outline-none focus:outline-none focus:ring-0 mb-[20px] bg-transparent"
          style={{
            backgroundColor: 'transparent',
            WebkitAppearance: 'none',
            boxShadow: 'none',
          }}
        />
        <hr className="w-full border-0 bg-blue-100 dark:bg-blue-900 h-[2px] mb-8" />
      </div>

      {/* 에디터 영역 */}
      <div className="grid grid-cols-2 gap-4 h-[400px]">
        {/* 마크다운 입력 */}
        <div className="border rounded-lg overflow-hidden flex flex-col bg-white dark:bg-gray-800">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b dark:border-gray-600">
            <div className="flex gap-2">
              <button className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100">
                H1
              </button>
              <button className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100">
                H2
              </button>
              <button className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100">
                B
              </button>
              <button className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100">
                I
              </button>
              <button className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100">
                S
              </button>
              <button className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100">
                목록
              </button>
              <button className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100">
                인용
              </button>
              <button className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100">
                &lt;&#47;&gt;
              </button>
            </div>
          </div>
          <textarea
            value={editorState.content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="flex-1 w-full p-4 focus:outline-none resize-none bg-transparent appearance-none border-none"
            placeholder="내용을 입력하세요!"
            style={{ backgroundColor: 'transparent' }}
          />
        </div>

        {/* 미리보기 */}
        <div className="border rounded-lg p-4 overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-200">
            <ReactMarkdown>{editorState.content}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 태그 영역 */}
      <div className="space-y-4 mt-8 mb-8">
        <h3 className="font-bold">저장된 태그</h3>
        <h3 className="font-bold">태그 편집</h3>
        {/* 태그 목록 구현 */}
      </div>

      {/* 하단 버튼 영역 */}
      <div
        className="flex justify-between items-center"
        style={{ marginTop: '70px' }}
      >
        <button
          onClick={handleGoBack}
          className="text-gray-600 hover:text-gray-800"
        >
          {'< 뒤로가기'}
        </button>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
            className="px-6 py-2 bg-secondary hover:secondary-hover text-primary rounded-lg font-sans"
          >
            임시저장
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary hover:primary-hover text-white rounded-lg font-sans"
          >
            등록하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
