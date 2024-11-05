'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { usePostEditor } from '@/features/Post/lib/hooks/usePostEditor';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';
import { Input } from '@/shared/ui/common/Input';
import { Post } from '@/features/Post/types';
import { useRouter } from 'next/navigation';

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
});

interface EditPostEditorProps {
  post: Post;
}

const EditPostEditor: React.FC<EditPostEditorProps> = ({ post }) => {
  const {
    editorState,
    categories,
    isLoading,
    error,
    handleTitleChange,
    handleContentChange,
    handleCategoryChange,
    handleGoBack,
    handleAddTag,
    handlePaste,
    handleRemoveTag,
    handleImageSelect,
    handleRemoveImage,
    handleSubmit,
  } = usePostEditor('edit', post); // mode와 post 전달

  const { isDarkMode } = useTheme();
  const [newTag, setNewTag] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTag = () => {
    if (newTag && editorState.tags.length < 5) {
      handleAddTag(newTag);
      setNewTag('');
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const insertImageToMarkdown = (imageId: string) => {
    const imageMarkdown = `![image](/storage/posts/${imageId})\n`;
    const content = editorState.content;
    const newContent =
      content.slice(0, cursorPosition) +
      imageMarkdown +
      content.slice(cursorPosition);

    handleContentChange(newContent);

    // 커서 위치 업데이트
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = cursorPosition + imageMarkdown.length;
        textareaRef.current.selectionStart = newPosition;
        textareaRef.current.selectionEnd = newPosition;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // 현재 커서 위치 저장
      if (textareaRef.current) {
        setCursorPosition(textareaRef.current.selectionStart);
      }

      const imageId = await handleImageSelect(file);
      if (imageId) {
        insertImageToMarkdown(imageId);
      }
    }
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      await handleSubmit();
    } catch (error) {
      console.error('포스트 수정 중 오류:', error);
      alert('포스트 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        에디터를 불러오고 있습니다,, 잠시만 기다려주세요
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
    >
      {/* 카테고리 선택 */}
      <select
        value={editorState.category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        style={{ width: '300px', height: 'auto' }}
        className="ml-4 mt-4 mb-[52px] px-4 border rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700"
      >
        <option value="">카테고리 선택</option>
        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
            className="text-gray-900 dark:text-gray-100 appearance-none border-none outline-none bg-transparent"
          >
            {category.name}
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
        <hr
          className="border-0 bg-blue-100 dark:bg-blue-900 h-[2px] mb-8"
          style={{ width: '800px' }}
        />
      </div>

      {/* 에디터 영역 */}
      <div className="grid grid-cols-2 gap-4 h-[400px] ml-4">
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
                H3
              </button>
              <button className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100">
                H4
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
              <button
                onClick={handleImageButtonClick}
                className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
              >
                사진
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={editorState.content}
            onPaste={handlePaste}
            onChange={(e) => handleContentChange(e.target.value)}
            className="flex-1 w-full p-4 focus:outline-none resize-none bg-transparent appearance-none border-none"
            placeholder="내용을 입력하세요!"
            style={{ backgroundColor: 'transparent' }}
          />
        </div>

        {/* 미리보기 */}
        <div className="border rounded-lg p-4 mr-4 overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-200">
            <ReactMarkdown>{editorState.content}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 이미지 목록 */}
      {editorState.images.length > 0 && (
        <div className="mt-4 ml-4">
          <h3 className="font-semibold mb-4">업로드된 이미지:</h3>
          <ul className="list-disc ml-6 space-y-2">
            {editorState.images.map((imageId) => (
              <li key={imageId} className="flex justify-between items-center">
                <span>이미지 ID: {imageId}</span>
                <Button onClick={() => handleRemoveImage(imageId)}>삭제</Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 태그 */}
      <div className={`dark space-y-4 mt-8 mb-8`}>
        <div className="flex items-center gap-4">
          <h3
            className={`ml-4 font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            저장된 태그
          </h3>
          <div className="flex items-center gap-2">
            {editorState.tags.map((tag) => (
              <div
                key={tag}
                className={`inline-flex items-center h-6 px-4 rounded-full border ${isDarkMode ? 'border-white bg-transparent text-white' : 'border-primary bg-transparent text-primary'}`}
              >
                <span
                  className={`font-semibold mr-2 ${isDarkMode ? 'text-white' : 'text-primary'}`}
                >
                  {tag}
                </span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${isDarkMode ? 'border-white text-white' : 'border-primary text-primary'} border`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <h3
            className={`ml-4 font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            태그 편집
          </h3>
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewTag(e.target.value)
              }
              placeholder="최대 5개까지 가능합니다!"
              className={`w-48 h-8 border rounded-lg focus:outline-none`}
              style={{
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000',
                borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
              }}
            />
            <button
              onClick={addTag}
              className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${isDarkMode ? 'border-white text-white' : 'border-primary text-primary'} border`}
            >
              <span className="text-xl">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역만 수정 */}
      <div
        className="flex justify-between items-center"
        style={{ marginTop: '50px' }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="px-6 py-2 mr-4 rounded-lg font-sans"
        >
          {'< 뒤로가기'}
        </Button>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="sm"
            className="px-6 py-2 bg-secondary hover:secondary-hover text-primary rounded-lg font-sans"
            onClick={handleGoBack}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 mr-4 bg-primary hover:primary-hover text-white rounded-lg font-sans"
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPostEditor;
