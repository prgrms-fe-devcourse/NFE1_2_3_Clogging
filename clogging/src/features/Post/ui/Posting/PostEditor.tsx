'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const PostEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, content });
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', { title, content });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 제목 입력 */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력해주세요"
        className="w-full px-4 py-2 text-xl mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* 에디터 컨테이너 */}
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-250px)]">
        {/* 마크다운 입력 영역 */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <div className="flex gap-2">
              <button
                className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                onClick={() => setContent((prev) => prev + '# ')}
              >
                H1
              </button>
              <button
                className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                onClick={() => setContent((prev) => prev + '## ')}
              >
                H2
              </button>
              <button
                className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                onClick={() => setContent((prev) => prev + '**볼드**')}
              >
                B
              </button>
              <button
                className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                onClick={() => setContent((prev) => prev + '*이탤릭*')}
              >
                I
              </button>
              <button
                className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                onClick={() => setContent((prev) => prev + '~~취소선~~')}
              >
                S
              </button>
              <button
                className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                onClick={() => setContent((prev) => prev + '\n- ')}
              >
                목록
              </button>
              <button
                className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                onClick={() => setContent((prev) => prev + '\n> ')}
              >
                인용
              </button>
              <button
                className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                onClick={() => setContent((prev) => prev + '\n```\n코드\n```')}
              >
                코드
              </button>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요 !"
            className="w-full h-[calc(100%-48px)] p-4 resize-none focus:outline-none"
          />
        </div>

        {/* 미리보기 영역 */}
        <div className="border rounded-lg p-4 overflow-y-auto">
          <div className="prose max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleSaveDraft}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          임시저장
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          등록하기
        </button>
      </div>
    </div>
  );
};

export default PostEditor;
