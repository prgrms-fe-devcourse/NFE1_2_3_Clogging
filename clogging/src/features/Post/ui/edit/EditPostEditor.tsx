'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

import { usePostEditor } from '@/features/Post/lib/hooks/usePostEditor';
import { useMarkdown } from '@/features/Post/lib/hooks/useMarkdown';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';
import { Input } from '@/shared/ui/common/Input';
import { Post } from '@/features/Post/types';

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
    handleRemoveTag,
    // handleImageSelect,
    handleImageLocalSelect,
    handleRemoveImage,
    handleSubmit,
  } = usePostEditor('edit', post); // 수정 모드

  const {
    text: markdownText,
    setText: setMarkdownText,
    handleH1Click,
    handleH2Click,
    handleH3Click,
    handleH4Click,
    handleBoldClick,
    handleItalicClick,
    handleStrikeClick,
    handleListClick,
    handleQuoteClick,
    handleCodeBlockClick,
  } = useMarkdown(editorState.content);

  React.useEffect(() => {
    handleContentChange(markdownText);
  }, [markdownText, handleContentChange]);

  const { isDarkMode } = useTheme();
  const [newTag, setNewTag] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isSubmitting] = useState(false);

  const addTag = () => {
    if (newTag && editorState.tags.length < 5) {
      handleAddTag(newTag);
      setNewTag('');
    } else if (editorState.tags.length >= 5) {
      alert('태그는 최대 5개까지만 추가할 수 있습니다!');
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const insertImageToMarkdown = async (imageUrl: string) => {
    const imageMarkdown = `![image](${imageUrl})\n`;
    const content = editorState.content;
    const newContent =
      content.slice(0, cursorPosition) +
      imageMarkdown +
      content.slice(cursorPosition);

    setMarkdownText(newContent);
    setImageUrls([...imageUrls, imageUrl]);

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

      try {
        const imageUrl = await handleImageLocalSelect(file);
        if (imageUrl) {
          insertImageToMarkdown(imageUrl);
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      }
    }
  };

  const onSubmit = async () => {
    try {
      await handleSubmit();
    } catch (error) {
      console.error('포스트 수정 중 오류:', error);
      alert('포스트 수정 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div
      className={`min-h-screen p-4 md:p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
    >
      {/* 카테고리 선택 */}
      <select
        value={editorState.category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="w-full md:w-[300px] px-4 py-2 mb-6 md:mb-[52px] border rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700"
      >
        <option value="">카테고리 선택</option>
        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
            className="text-gray-900 dark:text-gray-100"
          >
            {category.name}
          </option>
        ))}
      </select>

      {/* 제목 입력 */}
      <div className="flex flex-col items-center w-full">
        <input
          type="text"
          value={editorState.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="제목을 입력해주세요."
          className="w-full text-xl md:text-[35px] font-bold text-center appearance-none border-none outline-none focus:outline-none focus:ring-0 mb-4 md:mb-[20px] bg-transparent"
          style={{
            backgroundColor: 'transparent',
            WebkitAppearance: 'none',
            boxShadow: 'none',
          }}
        />
        <hr className="w-full md:w-[800px] border-0 bg-blue-100 dark:bg-blue-900 h-[2px] mb-6 md:mb-8" />
      </div>

      {/* 에디터 영역 */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 h-auto">
        {/* 마크다운 입력 */}
        <div className="border rounded-lg overflow-hidden flex flex-col bg-white dark:bg-gray-800 min-h-[300px]">
          <div className="bg-gray-50 dark:bg-gray-700 p-2 md:px-4 md:py-2 border-b dark:border-gray-600 overflow-x-auto">
            <div className="flex gap-2 whitespace-nowrap">
              <button
                onClick={handleH1Click}
                className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
              >
                H1
              </button>
              <button
                onClick={handleH2Click}
                className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
              >
                H2
              </button>
              <button
                onClick={handleH3Click}
                className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
              >
                H3
              </button>
              <button
                onClick={handleH4Click}
                className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
              >
                H4
              </button>
              <button
                onClick={handleBoldClick}
                className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
              >
                B
              </button>
              <button
                onClick={handleItalicClick}
                className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
              >
                I
              </button>
              <button
                onClick={handleStrikeClick}
                className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
              >
                S
              </button>
              <button
                onClick={handleListClick}
                className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
              >
                목록
              </button>
              <button
                onClick={handleQuoteClick}
                className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
              >
                인용
              </button>
              <button
                onClick={handleCodeBlockClick}
                className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
              >
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
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
            className="flex-1 w-full p-4 focus:outline-none resize-none bg-transparent appearance-none border-none"
            placeholder="내용을 입력하세요!"
            style={{ backgroundColor: 'transparent' }}
          />
        </div>

        {/* 미리보기 */}
        <div className="border rounded-lg p-4 overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 min-h-[300px]">
          <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-200">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {editorState.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 이미지 목록 */}
      {editorState.images.length > 0 && (
        <div className="mt-6 md:mt-8">
          <h3 className="font-semibold mb-4">업로드된 이미지:</h3>
          <ul className="list-disc ml-6 space-y-2">
            {editorState.images.map((imageId) => (
              <li
                key={imageId}
                className="flex justify-between items-center flex-wrap gap-2"
              >
                <span className="break-all">이미지 ID: {imageId}</span>
                <Button onClick={() => handleRemoveImage(imageId)}>삭제</Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 태그 */}
      <div className="space-y-4 mt-6 md:mt-8 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h3
            className={`font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            저장된 태그
          </h3>
          <div className="flex flex-wrap items-center gap-2">
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

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <h3
            className={`font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            태그 편집
          </h3>
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewTag(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  addTag();
                  e.preventDefault();
                }
              }}
              placeholder="최대 5개까지 가능합니다!"
              className="w-full md:w-48 h-8 border rounded-lg focus:outline-none"
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

      {/* 하단 버튼 영역 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="w-full md:w-auto px-6 py-2 rounded-lg font-sans"
        >
          {'< 뒤로가기'}
        </Button>
        <div className="flex gap-4 w-full md:w-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleGoBack}
            className="flex-1 md:flex-none px-6 py-2 bg-secondary hover:secondary-hover text-primary rounded-lg font-sans"
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-6 py-2 bg-primary hover:primary-hover text-white rounded-lg font-sans"
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPostEditor;
